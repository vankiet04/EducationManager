import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, 
  Tag, Tooltip, Tabs, Divider, message, Row, Col, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, FileTextOutlined,
  CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// API base URL
const API_URL = 'http://localhost:8080';

// Thiết lập cấu hình global cho axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Thêm interceptor để xử lý lỗi từ API
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Component for managing syllabuses
const ManageSyllabuses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [gradeColumns, setGradeColumns] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedGradeColumns, setSelectedGradeColumns] = useState([]);
  const [currentTab, setCurrentTab] = useState('1');
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1 });
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Load data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      let coursesData, syllabusesData, gradeColumnsData;
      
      try {
        // Gọi API lấy dữ liệu học phần
        const coursesResponse = await axios.get(`/api/hocphan`);
        console.log('API Response:', coursesResponse);
        coursesData = coursesResponse.data;
        // Map backend field names to frontend expected names
        coursesData = coursesData.map(course => ({
          id: course.id,
          maHocPhan: course.maHp,
          tenHocPhan: course.tenHp,
          soTinChi: course.soTinChi,
          khoaPhuTrach: course.nhomKienThucID ? course.nhomKienThucID : 'Chưa phân nhóm'
        }));
      } catch (error) {
        console.error('Error fetching courses:', error);
        message.error('Không thể tải dữ liệu học phần. Vui lòng thử lại sau.');
        return;
      }
      
      try {
        // Gọi API lấy dữ liệu đề cương
        const syllabusesResponse = await axios.get(`/api/decuongchitiet`);
        console.log('Syllabuses API Response:', syllabusesResponse);
        syllabusesData = syllabusesResponse.data;
        // Map data format from API to component expected format - match database field names
        syllabusesData = syllabusesData.map(syllabus => ({
          id: syllabus.id,
          hocPhanId: syllabus.hocPhanId || syllabus.hoc_phan_id,
          mucTieu: syllabus.mucTieu || syllabus.muc_tieu,
          noiDung: syllabus.noiDung || syllabus.noi_dung,
          phuongPhapGiangDay: syllabus.phuongPhapGiangDay || syllabus.phuong_phap_giang_day,
          phuongPhapDanhGia: syllabus.phuongPhapDanhGia || syllabus.phuong_phap_danh_gia,
          taiLieuThamKhao: syllabus.taiLieuThamKhao || syllabus.tai_lieu_tham_khao,
          // If hocPhan is available as an object, store its details too
          maHocPhan: syllabus.hocPhan ? syllabus.hocPhan.maHp : null,
          tenHocPhan: syllabus.hocPhan ? syllabus.hocPhan.tenHp : null,
          soTinChi: syllabus.hocPhan ? syllabus.hocPhan.soTinChi : null
        }));
      } catch (error) {
        console.error('Error fetching syllabuses:', error);
        message.error('Không thể tải dữ liệu đề cương. Vui lòng thử lại sau.');
        return;
      }
      
      try {
        // Gọi API lấy dữ liệu cột điểm
        const gradeColumnsResponse = await axios.get(`/api/cotdiem`);
        console.log('Grade Columns API Response:', gradeColumnsResponse);
        gradeColumnsData = gradeColumnsResponse.data;
        // Map API field names (snake_case) to component expected names (camelCase)
        gradeColumnsData = gradeColumnsData.map(column => ({
          id: column.id,
          decuongId: column.decuongId || column.decuong_id,
          tenCotDiem: column.tenCotDiem || column.ten_cot_diem,
          tyLePhanTram: column.tyLePhanTram || column.ty_le_phan_tram,
          hinhThuc: column.hinhThuc || column.hinh_thuc
        }));
        
        // Sort grade columns by percentage in ascending order
        gradeColumnsData.sort((a, b) => parseFloat(a.tyLePhanTram) - parseFloat(b.tyLePhanTram));
      } catch (error) {
        console.error('Error fetching grade columns:', error);
        message.error('Không thể tải dữ liệu cột điểm. Vui lòng thử lại sau.');
        return;
      }
      
      setCourses(coursesData);
      setSyllabuses(syllabusesData);
      setGradeColumns(gradeColumnsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  // Handle edit syllabus
  const handleEdit = async (record) => {
    setEditingRecord(record.id);
    setLoading(true);
    
    try {
      // Lấy danh sách cột điểm của đề cương
      const gradeColumnsResponse = await axios.get(`${API_URL}/api/cotdiem/decuong/${record.id}`);
      const syllabusCotDiem = gradeColumnsResponse.data;
      
      setSelectedGradeColumns(syllabusCotDiem);
      setTotalPercentage(calculateTotalPercentage(syllabusCotDiem));
      
      // Set form values based on the record
      form.setFieldsValue({
        hocPhanId: record.hocPhanId,
        mucTieu: record.mucTieu,
        noiDung: record.noiDung,
        phuongPhapGiangDay: record.phuongPhapGiangDay,
        // We don't set phuongPhapDanhGia from record since it now stores column IDs
        taiLieuThamKhao: record.taiLieuThamKhao,
        trangThai: record.trangThai,
        cotDiem: syllabusCotDiem.map(item => item.id)
      });
      
      setDetailsModalVisible(true);
      setIsViewMode(false);
    } catch (error) {
      console.error('Error fetching grade columns:', error);
      message.error('Không thể tải dữ liệu cột điểm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tỷ lệ phần trăm của các cột điểm đã chọn
  const calculateTotalPercentage = (columns) => {
    return columns.reduce((sum, column) => sum + parseFloat(column.tyLePhanTram || 0), 0);
  };

  // Xử lý chọn cột điểm
  const handleGradeColumnChange = (checkedValues) => {
    // Check if the sum of selected columns would exceed 100%
    const selectedColumns = gradeColumns.filter(column => checkedValues.includes(column.id));
    const total = calculateTotalPercentage(selectedColumns);
    
    if (total > 100) {
      message.warning('Tổng tỷ lệ phần trăm các cột điểm không được vượt quá 100%');
      // Don't update if total exceeds 100%
      return;
    }
    
    setSelectedGradeColumns(selectedColumns);
    setTotalPercentage(total);
  };

  // Handle delete syllabus
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề cương chi tiết này?',
      onOk: async () => {
        setLoading(true);
        try {
          // Delete the syllabus
          await axios.delete(`${API_URL}/api/decuongchitiet/${id}`);
          
          // Also delete all related grade columns
          const gradeColumnsData = await axios.get(`${API_URL}/api/cotdiem/decuong/${id}`);
          for (const column of gradeColumnsData.data) {
            await axios.delete(`${API_URL}/api/cotdiem/${column.id}`);
          }
          
          // Update the local state
          const updatedSyllabuses = syllabuses.filter(syllabus => syllabus.id !== id);
          setSyllabuses(updatedSyllabuses);
          
          message.success('Xóa đề cương thành công');
        } catch (error) {
          console.error('Error deleting syllabus:', error);
          message.error('Có lỗi xảy ra khi xóa đề cương');
          
          // If API fails, still update UI for better UX
          const updatedSyllabuses = syllabuses.filter(syllabus => syllabus.id !== id);
          setSyllabuses(updatedSyllabuses);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle approve syllabus
  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt',
      content: 'Bạn có chắc chắn muốn phê duyệt đề cương chi tiết này?',
      onOk: async () => {
        setLoading(true);
        try {
          // Get the current syllabus
          const syllabus = syllabuses.find(s => s.id === id);
          
          if (syllabus) {
            // Update the status to approved (1)
            const updatedSyllabus = { ...syllabus, trangThai: 1 };
            await axios.put(`${API_URL}/api/decuongchitiet/${id}`, updatedSyllabus);
            
            // Update the local state
            const updatedSyllabuses = syllabuses.map(s => {
              if (s.id === id) {
                return { ...s, trangThai: 1 };
              }
              return s;
            });
            
            setSyllabuses(updatedSyllabuses);
            message.success('Phê duyệt đề cương thành công');
          }
        } catch (error) {
          console.error('Error approving syllabus:', error);
          message.error('Có lỗi xảy ra khi phê duyệt đề cương');
          
          // If API fails, still update UI for better UX
          const updatedSyllabuses = syllabuses.map(syllabus => {
            if (syllabus.id === id) {
              return { ...syllabus, trangThai: 1 };
            }
            return syllabus;
          });
          
          setSyllabuses(updatedSyllabuses);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Convert selected grade column IDs to a string and store in phuongPhapDanhGia
      const selectedColumnIds = selectedGradeColumns.map(col => col.id).join(',');
      
      const syllabusData = {
        hocPhanId: values.hocPhanId,
        mucTieu: values.mucTieu,
        noiDung: values.noiDung,
        phuongPhapGiangDay: values.phuongPhapGiangDay,
        phuongPhapDanhGia: selectedColumnIds, // Store grade column IDs here
        taiLieuThamKhao: values.taiLieuThamKhao,
        trangThai: 0 // Set initial status to 0 (pending)
      };

      let response;
      if (editingRecord) {
        try {
          // Check if total percentage is 100% before saving
          const total = calculateTotalPercentage(selectedGradeColumns);
          if (total !== 100) {
            message.error('Tổng tỷ lệ phần trăm các cột điểm phải đúng 100%');
            setLoading(false);
            return;
          }
          
          // Update existing syllabus
          response = await axios.put(`${API_URL}/api/decuongchitiet/${editingRecord}`, syllabusData);
          
          // Update cột điểm for existing syllabus
          // First, delete all existing cotdiem for this syllabus
          const existingGradeColumns = await axios.get(`${API_URL}/api/cotdiem/decuong/${editingRecord}`);
          for (const column of existingGradeColumns.data) {
            await axios.delete(`${API_URL}/api/cotdiem/${column.id}`);
          }
          
          // Process selected grade columns to ensure proper formatting
          const formattedGradeColumns = selectedGradeColumns.map(column => ({
            decuongId: editingRecord,
            tenCotDiem: column.tenCotDiem || "",
            tyLePhanTram: parseFloat(column.tyLePhanTram) || 0,
            hinhThuc: column.hinhThuc || ""
          }));
          
          // Then create new ones - one by one with error handling
          for (const column of formattedGradeColumns) {
            try {
              await axios.post(`${API_URL}/api/cotdiem`, column);
            } catch (columnError) {
              console.error('Error adding grade column:', columnError);
              // Continue with the next column even if this one fails
            }
          }
        } catch (updateError) {
          console.error('Error updating syllabus or grade columns:', updateError);
          throw updateError;
        }
        
        message.success('Cập nhật đề cương thành công, đang chờ phê duyệt');
        
        // Update in local state
        const updatedSyllabuses = syllabuses.map(syllabus => {
          if (syllabus.id === editingRecord) {
            return { ...syllabus, ...syllabusData, trangThai: 0 }; // Reset to pending approval
          }
          return syllabus;
        });
        
        setSyllabuses(updatedSyllabuses);
      } else {
        try {
          // Check if total percentage is 100% before saving
          const total = calculateTotalPercentage(selectedGradeColumns);
          if (total !== 100) {
            message.error('Tổng tỷ lệ phần trăm các cột điểm phải đúng 100%');
            setLoading(false);
            return;
          }
          
          // Create new syllabus first
          response = await axios.post(`${API_URL}/api/decuongchitiet`, syllabusData);
          const newSyllabus = response.data;
          
          // Then add grade columns for the new syllabus
          if (selectedGradeColumns.length > 0) {
            // Process selected grade columns to ensure proper formatting
            const formattedGradeColumns = selectedGradeColumns.map(column => ({
              decuongId: newSyllabus.id,
              tenCotDiem: column.tenCotDiem || "",
              tyLePhanTram: parseFloat(column.tyLePhanTram) || 0,
              hinhThuc: column.hinhThuc || ""
            }));
            
            // Add grade columns one by one with error handling
            for (const column of formattedGradeColumns) {
              try {
                await axios.post(`${API_URL}/api/cotdiem`, column);
              } catch (columnError) {
                console.error('Error adding grade column:', columnError);
                // Continue with the next column even if this one fails
              }
            }
          }
          
          message.success('Thêm đề cương mới thành công, đang chờ phê duyệt');
          
          // Update in local state
          setSyllabuses([...syllabuses, newSyllabus]);
        } catch (createError) {
          console.error('Error creating syllabus or grade columns:', createError);
          throw createError;
        }
      }
      
      setDetailsModalVisible(false);
      form.resetFields();
      setSelectedGradeColumns([]);
      setTotalPercentage(0);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi lưu đề cương');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search and filters
  const filterData = () => {
    // First, enrich syllabuses with course data if not already present
    const enrichedData = syllabuses.map(syllabus => {
      // If syllabus already has course data (from API), use that
      if (syllabus.maHocPhan && syllabus.tenHocPhan) {
        return syllabus;
      }
      
      // Otherwise, find course data to enrich the syllabus
      const course = courses.find(c => c.id === syllabus.hocPhanId) || {};
      return {
        ...syllabus,
        maHocPhan: course.maHocPhan,
        tenHocPhan: course.tenHocPhan,
        soTinChi: course.soTinChi
      };
    });
    
    let filteredData = [...enrichedData];
    
    // Filter by search text
    if (searchText) {
      filteredData = filteredData.filter(item => 
        (item.maHocPhan && item.maHocPhan.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.tenHocPhan && item.tenHocPhan.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.mucTieu && item.mucTieu.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    return filteredData;
  };

  // Get status tag for display
  const getStatusTag = (status) => {
    // Kiểm tra cả giá trị số và chuỗi '1' hoặc 1
    if (status === 1 || status === '1') {
      return <Tag color="green">Đã phê duyệt</Tag>;
    } else {
      return <Tag color="gold">Chờ phê duyệt</Tag>;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
      key: 'maHocPhan',
      width: 120,
      sorter: (a, b) => a.maHocPhan?.localeCompare(b.maHocPhan),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Tên học phần',
      dataIndex: 'tenHocPhan',
      key: 'tenHocPhan',
      width: 200,
      sorter: (a, b) => a.tenHocPhan?.localeCompare(b.tenHocPhan),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'mucTieu',
      key: 'mucTieu',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      fixed: null,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<InfoCircleOutlined />} 
              size="small"
              onClick={() => handleViewDetails(record)}
            >
              Xem chi tiết
            </Button>
          </Tooltip>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
          {record.trangThai === 0 && ( // Show approve button only for pending items
            <Button 
              type="primary" 
              style={{ backgroundColor: '#52c41a' }}
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={() => handleApprove(record.id)}
            >
              Duyệt
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Show grade columns in syllabus details
  const showGradeColumnsDetails = async (syllabusId) => {
    try {
      // Get grade columns for this syllabus
      const gradeColumnsResponse = await axios.get(`${API_URL}/api/cotdiem/decuong/${syllabusId}`);
      const syllabusGradeColumns = gradeColumnsResponse.data.map(column => ({
        id: column.id,
        decuongId: column.decuongId || column.decuong_id,
        tenCotDiem: column.tenCotDiem || column.ten_cot_diem,
        tyLePhanTram: column.tyLePhanTram || column.ty_le_phan_tram,
        hinhThuc: column.hinhThuc || column.hinh_thuc
      }));
      
      // Sort by percentage in ascending order
      syllabusGradeColumns.sort((a, b) => parseFloat(a.tyLePhanTram) - parseFloat(b.tyLePhanTram));
      
      // Cập nhật state để hiển thị
      setSelectedGradeColumns(syllabusGradeColumns);
      
      // Calculate and update total percentage
      const total = calculateTotalPercentage(syllabusGradeColumns);
      setTotalPercentage(total);
      
      return syllabusGradeColumns;
    } catch (error) {
      console.error('Error fetching grade columns for syllabus:', error);
      message.error('Không thể tải dữ liệu cột điểm. Vui lòng thử lại sau.');
      return [];
    }
  };

  // Handle viewing details of syllabus
  const handleViewDetails = async (record) => {
    try {
      // Set view mode to true
      setIsViewMode(true);
      setEditingRecord(record.id);
      setLoading(true);
      
      // Get syllabus details
      const syllabusResponse = await axios.get(`${API_URL}/api/decuongchitiet/${record.id}`);
      const syllabusData = syllabusResponse.data;
      
      // Get the course details
      try {
        const courseResponse = await axios.get(`${API_URL}/api/hocphan/${syllabusData.hocPhanId || syllabusData.hoc_phan_id}`);
        const courseData = courseResponse.data;
        
        // Enrich syllabusData with course info if needed
        if (!syllabusData.tenHocPhan && courseData) {
          syllabusData.tenHocPhan = courseData.tenHp;
          syllabusData.maHocPhan = courseData.maHp;
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
      
      // Get grade columns for this syllabus
      await showGradeColumnsDetails(record.id);
      
      // Set form values based on the record
      form.setFieldsValue({
        hocPhanId: syllabusData.hocPhanId,
        mucTieu: syllabusData.mucTieu,
        noiDung: syllabusData.noiDung,
        phuongPhapGiangDay: syllabusData.phuongPhapGiangDay,
        taiLieuThamKhao: syllabusData.taiLieuThamKhao,
        cotDiem: selectedGradeColumns.map(item => item.id)
      });
      
      // Open modal
      setDetailsModalVisible(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      message.error('Không thể tải chi tiết đề cương. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };
  
  // Handle form submission for updating syllabus grade columns
  const handleGradeColumnsSubmit = async (syllabusId, gradeColumns) => {
    try {
      // First, delete all existing grade columns for this syllabus
      const existingColumns = await axios.get(`${API_URL}/api/cotdiem/decuong/${syllabusId}`);
      for (const column of existingColumns.data) {
        await axios.delete(`${API_URL}/api/cotdiem/${column.id}`);
      }
      
      // Then add new grade columns
      for (const column of gradeColumns) {
        const columnData = {
          decuongId: syllabusId,
          tenCotDiem: column.tenCotDiem,
          tyLePhanTram: column.tyLePhanTram,
          hinhThuc: column.hinhThuc
        };
        await axios.post(`${API_URL}/api/cotdiem`, columnData);
      }
      
      // Refresh data
      fetchData();
      message.success('Cập nhật cột điểm thành công');
    } catch (error) {
      console.error('Error updating grade columns:', error);
      message.error('Không thể cập nhật cột điểm. Vui lòng thử lại sau.');
    }
  };

  // Handle button click to show details modal for syllabus
  const handleShowDetailsButtonClick = (record) => {
    handleViewDetails(record);
  };

  // Handler for updating grade columns from a tab in the form
  const handleUpdateGradeColumnsButtonClick = (syllabusId) => {
    // Validate grade columns first
    if (totalPercentage !== 100) {
      message.error('Tổng tỷ lệ phần trăm của các cột điểm phải đúng 100%');
      return;
    }
    
    // Update grade columns
    handleGradeColumnsSubmit(syllabusId, selectedGradeColumns);
  };

  // Xử lý reset và làm mới dữ liệu
  const handleResetFilters = () => {
    setSearchText('');
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchData(); // Fetch data after resetting filters
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý đề cương chi tiết</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            value={searchText}
            onChange={handleSearch}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRecord(null);
              form.resetFields();
              setDetailsModalVisible(true);
            }}
          >
            Thêm đề cương
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleResetFilters}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </div>

      <style>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .action-column {
          white-space: nowrap;
        }
        .action-buttons {
          display: flex;
          flex-wrap: nowrap;
          gap: 6px;
        }
        .action-buttons .ant-btn {
          min-width: initial;
          padding: 0 8px;
        }
      `}</style>

      <Modal
        title={isViewMode ? "Chi tiết đề cương (Chỉ xem)" : (editingRecord ? "Sửa đề cương" : "Thêm đề cương chi tiết mới")}
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          form.resetFields();
          setIsViewMode(false);
        }}
        footer={(
          <Space>
            {isViewMode ? (
              <Button
                onClick={() => {
                  setDetailsModalVisible(false);
                  form.resetFields();
                  setIsViewMode(false);
                }}
              >
                Đóng
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setDetailsModalVisible(false);
                    form.resetFields();
                    setIsViewMode(false);
                  }}
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  onClick={form.submit}
                  loading={loading}
                  icon={<FileTextOutlined />}
                >
                  {editingRecord ? "Lưu thay đổi" : "Thêm đề cương"}
                </Button>
              </>
            )}
          </Space>
        )}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={isViewMode}
        >
          <Tabs activeKey={currentTab} onChange={handleTabChange}>
            <TabPane tab="Thông tin cơ bản" key="1">
              <Form.Item
                name="hocPhanId"
                label="Học phần"
                rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}
              >
                <Select 
                  placeholder="Chọn học phần"
                  showSearch
                  optionFilterProp="children"
                >
                  {courses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.maHocPhan} - {course.tenHocPhan}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="mucTieu"
                label="Mục tiêu học phần"
                rules={[{ required: true, message: 'Vui lòng nhập mục tiêu học phần!' }]}
              >
                <TextArea rows={3} placeholder="Nhập mục tiêu của học phần" />
              </Form.Item>

              <Form.Item
                name="noiDung"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung học phần!' }]}
              >
                <TextArea rows={3} placeholder="Nhập nội dung chi tiết của học phần" />
              </Form.Item>
            </TabPane>

            <TabPane tab="Phương pháp giảng dạy & Tài liệu" key="2">
              <Form.Item
                name="phuongPhapGiangDay"
                label="Phương pháp giảng dạy"
                rules={[{ required: true, message: 'Vui lòng nhập phương pháp giảng dạy!' }]}
              >
                <TextArea rows={3} placeholder="Nhập phương pháp giảng dạy của học phần" />
              </Form.Item>

              <Form.Item
                name="taiLieuThamKhao"
                label="Tài liệu tham khảo"
                rules={[{ required: true, message: 'Vui lòng nhập tài liệu tham khảo!' }]}
              >
                <TextArea rows={3} placeholder="Nhập danh sách tài liệu tham khảo" />
              </Form.Item>

              {/* Hidden field for status */}
              <Form.Item
                name="trangThai"
                hidden
                initialValue={0} // Default: pending approval
              >
                <Input />
              </Form.Item>
              
              {/* Hidden field for phuongPhapDanhGia which will store selected column IDs */}
              <Form.Item
                name="phuongPhapDanhGia"
                hidden
              >
                <Input />
              </Form.Item>
            </TabPane>

            <TabPane tab="Cột điểm" key="3">
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Cột điểm của đề cương</Title>
                <div style={{ 
                  padding: '8px 16px',
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}>
                  <Text strong>
                    Tổng tỷ lệ: 
                    <span style={{ color: '#52c41a', marginLeft: 8 }}>
                      {totalPercentage}%
                    </span>
                  </Text>
                </div>

                <Form.Item
                  name="cotDiem"
                >
                  <Checkbox.Group
                    style={{ width: '100%' }}
                    onChange={handleGradeColumnChange}
                  >
                    <Row gutter={[16, 16]}>
                      {gradeColumns.map(column => (
                        <Col span={12} key={column.id}>
                          <Checkbox value={column.id}>
                            <Space direction="vertical" size={0}>
                              <Text strong>{column.tenCotDiem}</Text>
                              <Text type="secondary">Tỷ lệ: {column.tyLePhanTram}% - Hình thức: {column.hinhThuc}</Text>
                            </Space>
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </TabPane>

            
          </Tabs>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageSyllabuses; 