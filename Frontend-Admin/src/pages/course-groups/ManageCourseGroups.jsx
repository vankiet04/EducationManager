import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, Tag, 
  DatePicker, Tooltip, Badge, Collapse, Divider, Tabs, message, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, 
  ReloadOutlined, DownOutlined, FileAddOutlined, UsergroupAddOutlined, ScheduleOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import courseGroupService from '../../api/courseGroupService';
import courseService from '../../api/courseService';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ManageCourseGroups = () => {
  const [courseGroups, setCourseGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [form] = Form.useForm();
  const [addType, setAddType] = useState('single'); // 'single' hoặc 'multiple'
  const [bulkCount, setBulkCount] = useState(1); // Số lượng khi thêm nhiều
  const [academicYears, setAcademicYears] = useState([]);
  const [coursesInPlan, setCoursesInPlan] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  // Lấy ngày hiện tại cho validation
  const today = moment().startOf('day');
  // Lấy năm hiện tại
  const currentYear = moment().year();

  // Mô phỏng dữ liệu học kỳ (có thể thay thế bằng API nếu có)
  const mockSemesters = [
    { id: 1, ten_hoc_ky: 'Học kỳ 1 năm 2023-2024', thoi_gian_bat_dau: '2023-08-15', thoi_gian_ket_thuc: '2024-01-15' },
    { id: 2, ten_hoc_ky: 'Học kỳ 2 năm 2023-2024', thoi_gian_bat_dau: '2024-02-01', thoi_gian_ket_thuc: '2024-06-30' },
    { id: 3, ten_hoc_ky: 'Học kỳ 3 năm 2023-2024', thoi_gian_bat_dau: '2024-07-01', thoi_gian_ket_thuc: '2024-08-15' },
  ];

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchData();
    fetchAcademicYears();
  }, []);

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy danh sách kế hoạch mở nhóm
      const courseGroupsData = await courseGroupService.getAllCourseGroups();
      setCourseGroups(courseGroupsData);
      
      // Lấy danh sách học phần
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
      
      // Lấy danh sách giảng viên
      const lecturersResponse = await axios.get('http://localhost:8080/api/giangvien');
      setLecturers(lecturersResponse.data || []);
      
      // Sử dụng dữ liệu học kỳ giả lập (có thể thay thế bằng API)
      setSemesters(mockSemesters);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu từ máy chủ'
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách năm học
  const fetchAcademicYears = () => {
    // Tạo danh sách năm học từ năm hiện tại đến năm 2050
    const currentYearValue = currentYear;
    const years = [];
    
    for (let i = 0; i <= 2050 - currentYearValue; i++) {
      const startYear = currentYearValue + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    
    setAcademicYears(years);
  };

  // Lấy dữ liệu từ kế hoạch dạy học theo năm học và học kỳ
  const fetchCoursesFromTeachingPlan = async (namHoc, hocKy) => {
    setLoading(true);
    try {
      // Chuyển đổi định dạng năm học từ chuỗi sang số nguyên nếu cần
      // Ví dụ: "2023-2024" -> 2023
      const numericYear = parseInt(namHoc.split('-')[0]);
      
      // Gọi API để lấy danh sách kế hoạch dạy học theo năm học và học kỳ
      const response = await axios.get(`http://localhost:8080/api/KeHoachDayHoc/search`, {
        params: {
          namHoc: numericYear,
          hocKy: hocKy
        }
      });
      
      console.log('Kế hoạch dạy học theo năm và học kỳ:', response.data);
      
      if (response.data && response.data.length > 0) {
        // Lấy ID của các học phần từ kế hoạch dạy học
        const hocPhanIds = response.data.map(plan => plan.hoc_phan_id);
        
        // Lọc danh sách học phần theo ID
        const coursesInPlan = courses.filter(course => hocPhanIds.includes(course.id));
        
        console.log('Học phần trong kế hoạch dạy học:', coursesInPlan);
        setCoursesInPlan(coursesInPlan);
      } else {
        setCoursesInPlan([]);
        message.info('Không tìm thấy học phần nào trong kế hoạch dạy học cho học kỳ và năm học đã chọn');
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ kế hoạch dạy học:', error);
      message.error('Không thể lấy danh sách học phần từ kế hoạch dạy học');
      setCoursesInPlan([]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Xử lý lọc theo học kỳ
  const handleSemesterFilter = (value) => {
    setSemesterFilter(value);
  };

  // Xử lý lọc theo năm học (mới)
  const handleYearFilter = (value) => {
    setYearFilter(value);
  };

  // Lọc dữ liệu theo điều kiện
  const filteredData = () => {
    let result = [...courseGroups];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(group => 
        (group.maNhom && group.maNhom.toLowerCase().includes(searchText.toLowerCase())) ||
        (group.hocPhanId && group.hocPhanId.toString().includes(searchText.toLowerCase())) ||
        (group.hocKy && group.hocKy.toString().includes(searchText.toLowerCase())) ||
        (group.namHoc && group.namHoc.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Lọc theo học kỳ
    if (semesterFilter !== 'all') {
      const semesterId = parseInt(semesterFilter);
      result = result.filter(group => group.hocKy === semesterId);
    }

    // Lọc theo năm học (mới)
    if (yearFilter !== 'all') {
      result = result.filter(group => group.namHoc === yearFilter);
    }

    return result;
  };

  // Xử lý chỉnh sửa nhóm học phần
  const handleEdit = async (record) => {
    try {
      // Kiểm tra xem kế hoạch đã kết thúc hay chưa
      const endDate = moment(record.thoiGianKetThuc);
      if (endDate.isBefore(today)) {
        Modal.info({
          title: 'Không thể chỉnh sửa',
          content: 'Kế hoạch mở nhóm này đã kết thúc và không thể chỉnh sửa.'
        });
        return;
      }

      setLoading(true);
      const courseGroup = await courseGroupService.getCourseGroupById(record.id);
      setEditingId(courseGroup.id);
      form.setFieldsValue({
        hocPhanId: courseGroup.hocPhanId,
        maNhom: courseGroup.maNhom,
        namHoc: courseGroup.namHoc,
        hocKy: courseGroup.hocKy,
        thoi_gian: [
          moment(courseGroup.thoiGianBatDau), 
          moment(courseGroup.thoiGianKetThuc)
        ],
        soLuongSV: courseGroup.soLuongSV,
        trangThai: courseGroup.trangThai
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin kế hoạch mở nhóm:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể lấy thông tin kế hoạch mở nhóm'
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa nhóm học phần
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa',
      content: 'Bạn có chắc chắn muốn vô hiệu hóa kế hoạch mở nhóm học phần này?',
      onOk: async () => {
        try {
          setLoading(true);
          
          // Sử dụng phương thức DELETE thay vì cập nhật
          await courseGroupService.deleteCourseGroup(id);
          
          // Cập nhật dữ liệu trên giao diện
          setCourseGroups(prev => prev.filter(group => group.id !== id));
          
          Modal.success({
            content: 'Vô hiệu hóa kế hoạch mở nhóm học phần thành công'
          });
          
        } catch (error) {
          console.error('Lỗi khi vô hiệu hóa kế hoạch mở nhóm:', error);
          Modal.error({
            title: 'Lỗi',
            content: `Không thể vô hiệu hóa kế hoạch mở nhóm: ${error.response?.data?.message || error.message}`
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Tạo mã nhóm tự động theo quy tắc <mã_học_phần>.N<stt_nhom>.<hk>.<nambd><namkt>
  const generateGroupCode = () => {
    // Lấy thông tin từ form
    const courseId = form.getFieldValue('hocPhanId');
    const hocKy = form.getFieldValue('hocKy');
    const namHoc = form.getFieldValue('namHoc');
    
    if (!courseId) {
      return; // Chỉ hiển thị thông báo khi người dùng nhấn thêm
    }

    // Tìm thông tin học phần
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Xử lý năm học để lấy định dạng ngắn (ví dụ: 2023-2024 -> 2324)
    const namHocParts = namHoc.split('-');
    let shortYear = '';
    if (namHocParts.length === 2) {
      const startYear = namHocParts[0].substring(2); // Lấy 2 số cuối của năm bắt đầu
      const endYear = namHocParts[1].substring(2);   // Lấy 2 số cuối của năm kết thúc
      shortYear = startYear + endYear;
    } else {
      // Nếu định dạng năm học không đúng, sử dụng năm hiện tại
      const thisYear = currentYear.toString().substring(2);
      const nextYear = (currentYear + 1).toString().substring(2);
      shortYear = thisYear + nextYear;
    }
    
    // Tìm số nhóm lớn nhất hiện có của học phần này, cùng học kỳ và năm học
    const existingGroups = courseGroups.filter(g => 
      g.hocPhanId === courseId && 
      g.hocKy === hocKy && 
      g.namHoc === namHoc
    );
    
    // Tìm số thứ tự nhóm lớn nhất
    let maxGroupNumber = 0;
    existingGroups.forEach(group => {
      const maNhom = group.maNhom || '';
      // Tách mã nhóm để lấy số thứ tự (ví dụ từ "IT001.N5.K2.2324" lấy ra 5)
      const matches = maNhom.match(/\.N(\d+)\./);
      if (matches && matches.length > 1) {
        const groupNumber = parseInt(matches[1], 10);
        if (!isNaN(groupNumber) && groupNumber > maxGroupNumber) {
          maxGroupNumber = groupNumber;
        }
      }
    });
    
    // Tạo mã nhóm mới với số thứ tự tăng 1
    const newGroupNumber = maxGroupNumber + 1;
    const newGroupCode = `${course.maHp || 'HP'}.N${newGroupNumber}.K${hocKy}.${shortYear}`;
    
    form.setFieldsValue({ maNhom: newGroupCode });
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      // Kiểm tra đầy đủ thông tin
      if (!values.hocPhanId) {
        message.error('Vui lòng chọn học phần');
        return;
      }
      
      // Kiểm tra năm học không được bé hơn năm hiện tại
      const namHoc = values.namHoc || '';
      const startYearStr = namHoc.split('-')[0];
      const startYear = parseInt(startYearStr, 10);
      
      if (!isNaN(startYear) && startYear < currentYear) {
        message.error(`Năm học không được bé hơn năm hiện tại (${currentYear})`);
        setLoading(false);
        return;
      }

      // Kiểm tra thời gian bắt đầu và kết thúc phải lớn hơn hoặc bằng ngày hôm nay
      const startDate = values.thoi_gian[0];
      const endDate = values.thoi_gian[1];
      
      if (startDate.isBefore(today)) {
        message.error('Thời gian bắt đầu phải lớn hơn hoặc bằng ngày hôm nay');
        setLoading(false);
        return;
      }
      
      if (endDate.isBefore(today)) {
        message.error('Thời gian kết thúc phải lớn hơn hoặc bằng ngày hôm nay');
        setLoading(false);
        return;
      }

      // Kiểm tra mã nhóm
      if (addType === 'single' && !values.maNhom) {
        message.error('Vui lòng nhập hoặc tạo mã nhóm');
        return;
      }

      setLoading(true);

      // Chuẩn bị dữ liệu từ form
      // Chuyển đổi dữ liệu sang định dạng mà backend mong đợi
      const baseGroupData = {
        hocPhan: { 
          id: values.hocPhanId
        },
        maNhom: values.maNhom || '',
        namHoc: values.namHoc || '',
        hocKy: values.hocKy || 1,
        thoiGianBatDau: values.thoi_gian[0].format('YYYY-MM-DD'),
        thoiGianKetThuc: values.thoi_gian[1].format('YYYY-MM-DD'),
        soLuongSv: values.soLuongSV || 0,
        trangThai: 1 // Mặc định là hoạt động
      };

      if (editingId) {
        // Trường hợp chỉnh sửa (chỉ sửa 1 bản ghi)
        const updateData = {
          ...baseGroupData,
          id: editingId
        };
        
        // Gọi API cập nhật
        const updatedGroup = await courseGroupService.updateCourseGroup(editingId, updateData);
        
        // Cập nhật dữ liệu trên giao diện
        setCourseGroups(prev => prev.map(group => {
          if (group.id === editingId) {
            return updatedGroup;
          }
          return group;
        }));
        
        Modal.success({
          content: 'Cập nhật kế hoạch mở nhóm học phần thành công'
        });
      } else if (addType === 'single') {
        // Trường hợp thêm 1 bản ghi
        const newGroupData = {
          ...baseGroupData
        };
        
        // Thêm mới nhóm học phần
        try {
          const newGroup = await courseGroupService.createCourseGroup(newGroupData);
          
          // Cập nhật dữ liệu trên giao diện
          setCourseGroups(prev => [...prev, newGroup]);
          
          Modal.success({
            content: 'Thêm kế hoạch mở nhóm học phần mới thành công'
          });
        } catch (error) {
          console.error('Lỗi chi tiết khi tạo kế hoạch mở nhóm đơn:', error);
          message.error('Không thể tạo kế hoạch mở nhóm học phần. Vui lòng kiểm tra dữ liệu nhập vào.');
          setLoading(false);
          return;
        }
      } else {
        // Trường hợp thêm nhiều bản ghi
        const count = values.bulkCount || 1;
        const courseId = values.hocPhanId;
        const hocKy = values.hocKy;
        const namHoc = values.namHoc;
        
        if (!courseId) {
          message.error('Không tìm thấy thông tin học phần');
          setLoading(false);
          return;
        }
        
        const course = courses.find(c => c.id === courseId);
        if (!course) {
          message.error('Không tìm thấy thông tin học phần');
          setLoading(false);
          return;
        }
        
        // Xử lý năm học để lấy định dạng ngắn
        const namHocParts = namHoc.split('-');
        let shortYear = '';
        if (namHocParts.length === 2) {
          const startYear = namHocParts[0].substring(2);
          const endYear = namHocParts[1].substring(2);
          shortYear = startYear + endYear;
        } else {
          const thisYear = currentYear.toString().substring(2);
          const nextYear = (currentYear + 1).toString().substring(2);
          shortYear = thisYear + nextYear;
        }
        
        // Tìm số nhóm lớn nhất hiện có
        const existingGroups = courseGroups.filter(g => 
          g.hocPhanId === courseId && 
          g.hocKy === hocKy && 
          g.namHoc === namHoc
        );
        
        // Tìm số thứ tự nhóm lớn nhất
        let maxGroupNumber = 0;
        existingGroups.forEach(group => {
          const maNhom = group.maNhom || '';
          const matches = maNhom.match(/\.N(\d+)\./);
          if (matches && matches.length > 1) {
            const groupNumber = parseInt(matches[1], 10);
            if (!isNaN(groupNumber) && groupNumber > maxGroupNumber) {
              maxGroupNumber = groupNumber;
            }
          }
        });
        
        // Số thứ tự nhóm bắt đầu
        let nextGroupNumber = maxGroupNumber + 1;
        
        // Tạo mảng promises để thêm nhiều bản ghi cùng lúc
        const newGroups = [];
        
        for (let i = 0; i < count; i++) {
          const groupNumber = nextGroupNumber + i;
          const maNhom = `${course.maHp || 'HP'}.N${groupNumber}.K${hocKy}.${shortYear}`;
          
          const groupData = {
            ...baseGroupData,
            maNhom: maNhom
          };
          
          try {
            // Thêm tuần tự thay vì Promise.all để tránh lỗi
            const newGroup = await courseGroupService.createCourseGroup(groupData);
            newGroups.push(newGroup);
          } catch (error) {
            console.error(`Lỗi khi tạo nhóm ${maNhom}:`, error);
            message.error(`Lỗi khi tạo nhóm ${maNhom}`);
          }
        }
        
        // Cập nhật dữ liệu trên giao diện nếu có nhóm được tạo thành công
        if (newGroups.length > 0) {
          setCourseGroups(prev => [...prev, ...newGroups]);
          
          Modal.success({
            content: `Đã thêm thành công ${newGroups.length} kế hoạch mở nhóm học phần`
          });
        } else {
          message.error('Không có nhóm nào được tạo thành công');
          setLoading(false);
          return;
        }
      }
      
      setIsModalVisible(false);
      form.resetFields();
      
      // Refresh dữ liệu để đảm bảo tính nhất quán
      fetchData();
    } catch (error) {
      console.error('Lỗi khi lưu kế hoạch mở nhóm:', error);
      Modal.error({
        title: 'Lỗi',
        content: `Không thể ${editingId ? 'cập nhật' : 'thêm'} kế hoạch mở nhóm: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật danh sách học phần lọc khi thay đổi năm học và học kỳ
  const updateFilteredCourses = () => {
    try {
      // Chỉ lọc khi đã chọn cả năm học và học kỳ
      if (selectedYear && selectedSemester) {
        if (coursesInPlan.length > 0) {
          setFilteredCourses(coursesInPlan);
        } else {
          // Nếu không có học phần trong kế hoạch, hiển thị toàn bộ
          setFilteredCourses(courses);
        }
      } else {
        // Nếu chưa chọn năm học hoặc học kỳ, hiển thị toàn bộ
        setFilteredCourses(courses);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật danh sách học phần:', error);
      // Trong trường hợp lỗi, hiển thị toàn bộ
      setFilteredCourses(courses);
    }
  };

  // Sử dụng useEffect để cập nhật danh sách học phần lọc khi có sự thay đổi
  useEffect(() => {
    updateFilteredCourses();
  }, [selectedYear, selectedSemester, coursesInPlan, courses]);

  // Định nghĩa các cột trong bảng
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
      title: 'Học phần ID',
      dataIndex: 'hocPhanId',
      key: 'hocPhanId',
      width: 120,
      render: (hocPhanId) => {
        const course = courses.find(c => c.id === hocPhanId);
        return (
          <Tooltip placement="topLeft" title={course?.tenHp}>
            {course?.maHp || hocPhanId}
          </Tooltip>
        );
      },
      sorter: (a, b) => a.hocPhanId - b.hocPhanId,
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'maNhom',
      key: 'maNhom',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.maNhom.localeCompare(b.maNhom),
    },
    {
      title: 'Năm học',
      dataIndex: 'namHoc',
      key: 'namHoc',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.namHoc.localeCompare(b.namHoc),
    },
    {
      title: 'Học kỳ',
      dataIndex: 'hocKy',
      key: 'hocKy',
      width: 80,
      align: 'center',
      render: (hocKy) => (
        <Tag color={hocKy === 1 ? 'blue' : hocKy === 2 ? 'green' : 'orange'}>
          {hocKy === 1 ? 'Học kỳ 1' : hocKy === 2 ? 'Học kỳ 2' : 'Học kỳ 3'}
        </Tag>
      ),
      sorter: (a, b) => a.hocKy - b.hocKy,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      key: 'thoiGianBatDau',
      width: 150,
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.thoiGianBatDau).unix() - moment(b.thoiGianBatDau).unix(),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      key: 'thoiGianKetThuc',
      width: 150,
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.thoiGianKetThuc).unix() - moment(b.thoiGianKetThuc).unix(),
    },
    {
      title: 'Số lượng SV',
      dataIndex: 'soLuongSV',
      key: 'soLuongSV',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.soLuongSV - b.soLuongSV,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      align: 'center',
      render: (trangThai, record) => {
        // Kiểm tra xem kế hoạch đã kết thúc hay chưa
        const isEnded = moment(record.thoiGianKetThuc).isBefore(today);
        
        if (isEnded) {
          return <Tag color="purple">Đã kết thúc</Tag>;
        } else if (trangThai === 1) {
          return <Tag color="green">Hoạt động</Tag>;
        } else {
          return <Tag color="red">Không hoạt động</Tag>;
        }
      },
      sorter: (a, b) => {
        // Sắp xếp theo thứ tự: "Đã kết thúc" > "Hoạt động" > "Không hoạt động"
        const aEnded = moment(a.thoiGianKetThuc).isBefore(today) ? 2 : a.trangThai;
        const bEnded = moment(b.thoiGianKetThuc).isBefore(today) ? 2 : b.trangThai;
        return aEnded - bEnded;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      className: 'action-column',
      render: (_, record) => {
        // Kiểm tra xem kế hoạch đã kết thúc hay chưa
        const isEnded = moment(record.thoiGianKetThuc).isBefore(today);

        return (
          <Space size="small" className="action-buttons">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              disabled={isEnded}
            >
              Sửa
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
              disabled={isEnded}
            >
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý kế hoạch mở nhóm</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          {/* Combobox lọc theo năm học */}
          <Select
            placeholder="Năm học"
            style={{ width: 150 }}
            value={yearFilter}
            onChange={handleYearFilter}
          >
            <Option value="all">Tất cả năm học</Option>
            {academicYears.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
          {/* Combobox lọc theo học kỳ */}
          <Select
            placeholder="Học kỳ"
            style={{ width: 150 }}
            value={semesterFilter}
            onChange={handleSemesterFilter}
          >
            <Option value="all">Tất cả học kỳ</Option>
            <Option value="1">Học kỳ 1</Option>
            <Option value="2">Học kỳ 2</Option>
            <Option value="3">Học kỳ 3</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setAddType('single');
              setIsModalVisible(true);
              // Đảm bảo danh sách học phần được reset
              setFilteredCourses(courses);
            }}
          >
            Thêm mới
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </div>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredData()}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`
          }}
          size="middle"
          scroll={{ x: 1200 }}
          bordered={false}
        />
      </div>

      <style jsx global>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .action-column {
          white-space: nowrap;
          box-shadow: none !important;
          background: transparent !important;
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
        .ant-table-cell {
          border-right: none !important;
        }
        .ant-table-thead > tr > th {
          border-right: none !important;
          background-color: #f5f5f5;
        }
        .ant-table-tbody > tr > td {
          border-right: none !important;
        }
      `}</style>

      <Modal
        title={editingId ? "Cập nhật kế hoạch mở nhóm" : "Thêm kế hoạch mở nhóm"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedYear('');
          setSelectedSemester(null);
        }}
        footer={null}
        width={700}
      >
        <Tabs 
          activeKey={editingId ? 'single' : addType}
          onChange={(key) => !editingId && setAddType(key)}
          style={{ marginBottom: '20px' }}
        >
          <TabPane tab="Thêm 1" key="single" />
          {!editingId && <TabPane tab="Thêm nhiều" key="multiple" />}
        </Tabs>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Divider orientation="left">Thông tin cơ bản</Divider>
          
          <Row style={{ marginBottom: '16px' }}>
            <Col span={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  name="namHoc"
                  label="Năm học"
                  rules={[{ required: true, message: 'Vui lòng chọn năm học!' }]}
                >
                  <Select 
                    style={{ width: '100%' }}
                    placeholder="Chọn năm học"
                    disabled={!!editingId}
                    onChange={(value) => {
                      handleYearFilter(value);
                      // Reset giá trị học phần khi thay đổi năm học
                      form.setFieldsValue({ hocPhanId: undefined });
                    }}
                  >
                    {academicYears.map(year => (
                      <Option key={year} value={year}>{year}</Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="hocKy"
                  label="Học kỳ"
                  rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
                >
                  <Select 
                    style={{ width: '100%' }}
                    placeholder="Chọn học kỳ"
                    disabled={!!editingId}
                    onChange={(value) => {
                      handleSemesterFilter(value);
                      // Reset giá trị học phần khi thay đổi học kỳ
                      form.setFieldsValue({ hocPhanId: undefined });
                    }}
                  >
                    <Option value={1}>Học kỳ 1</Option>
                    <Option value={2}>Học kỳ 2</Option>
                    <Option value={3}>Học kỳ 3</Option>
                  </Select>
                </Form.Item>
                
                {selectedYear && selectedSemester && (
                  <div style={{ marginBottom: '8px' }}>
                    <Tag color={coursesInPlan.length > 0 ? 'success' : 'warning'}>
                      {coursesInPlan.length > 0 
                        ? `Tìm thấy ${coursesInPlan.length} học phần trong kế hoạch dạy học`
                        : 'Không tìm thấy học phần trong kế hoạch dạy học'}
                    </Tag>
                  </div>
                )}
              </Space>
            </Col>
          </Row>
          
          {/* Học phần (cải tiến chức năng tìm kiếm) */}
          <Form.Item
            name="hocPhanId"
            label="Học phần"
            rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn học phần"
              disabled={!!editingId}
              optionFilterProp="label"
              onChange={(value) => {
                // Reset giá trị nhóm khi thay đổi học phần
                form.setFieldsValue({ maNhom: null });
                if (addType === 'single') {
                  setTimeout(generateGroupCode, 100);
                }
              }}
              filterOption={(input, option) => {
                if (!option || !option.label) return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={filteredCourses.map(course => ({
                value: course.id,
                label: `${course.maHp || ''} - ${course.tenHp || ''}`
              }))}
              dropdownRender={menu => (
                <div>
                  {menu}
                  {filteredCourses.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      {selectedYear && selectedSemester ? (
                        <div>Không tìm thấy học phần trong kế hoạch dạy học</div>
                      ) : (
                        <div>Vui lòng chọn năm học và học kỳ trước</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            />
          </Form.Item>
          
          <Form.Item
            name="thoi_gian"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <RangePicker 
              style={{ width: '100%' }} 
              locale={locale}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                // Không cho phép chọn ngày trong quá khứ
                return current && current < today;
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="soLuongSV"
            label="Số lượng sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng sinh viên!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          {(!editingId && addType === 'multiple') ? (
            <Form.Item
              name="bulkCount"
              label="Số lượng nhóm cần tạo"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng nhóm!' }]}
              initialValue={1}
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>
          ) : (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <Form.Item
                name="maNhom"
                label="Mã nhóm"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Ví dụ: IT001.N1.K1.2324" disabled={!!editingId} />
              </Form.Item>
              
              <Button 
                type="default" 
                onClick={generateGroupCode}
                disabled={!!editingId || !form.getFieldValue('hocPhanId')}
                style={{ marginTop: '29px' }}
              >
                Tạo mã nhóm
              </Button>
            </div>
          )}
          
          {editingId && (
            <Form.Item
              name="trangThai"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value={1}>Hoạt động</Option>
                <Option value={0}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setSelectedYear('');
                  setSelectedSemester(null);
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
              >
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageCourseGroups; 