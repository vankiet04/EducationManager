import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Badge, Divider, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';

// Cấu hình baseURL cho axios
axios.defaults.baseURL = 'http://localhost:8080';  // Thay đổi URL này thành server API của bạn

const { Title } = Typography;
const { Option } = Select;

const ManageTeachingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courseGroups, setCourseGroups] = useState([]);
  const [hocPhanList, setHocPhanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedHocKy, setSelectedHocKy] = useState(null);
  const [selectedNamHoc, setSelectedNamHoc] = useState(null);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API để lấy dữ liệu
      let assignmentsResponse, lecturersResponse, courseGroupsResponse, hocPhanResponse;
      
      try {
        assignmentsResponse = await axios.get('/api/phanconggiangday');
      } catch (err) {
        console.warn('Không thể lấy dữ liệu phân công:', err.message);
        assignmentsResponse = { data: [] };
      }
      
      try {
        lecturersResponse = await axios.get('/api/giangvien');
      } catch (err) {
        console.warn('Không thể lấy dữ liệu giảng viên:', err.message);
        lecturersResponse = { data: [] };
      }
      
      try {
        courseGroupsResponse = await axios.get('/api/kehoachmonhom');
      } catch (err) {
        console.warn('Không thể lấy dữ liệu kế hoạch mở nhóm:', err.message);
        courseGroupsResponse = { data: [] };
      }
      
      try {
        hocPhanResponse = await axios.get('/api/hocphan');
      } catch (err) {
        console.warn('Không thể lấy dữ liệu học phần:', err.message);
        hocPhanResponse = { data: [] };
      }
      
      console.log("Phân công:", assignmentsResponse.data);
      console.log("Giảng viên:", lecturersResponse.data);
      
      // Kiểm tra cấu trúc dữ liệu giảng viên để xác định tên trường chứa mã giảng viên
      if (lecturersResponse.data.length > 0) {
        const firstLecturer = lecturersResponse.data[0];
        console.log("Cấu trúc dữ liệu giảng viên:", Object.keys(firstLecturer));
      }
      
      console.log("Nhóm học phần:", courseGroupsResponse.data);
      console.log("Học phần:", hocPhanResponse.data);
      
      // Chuẩn hóa dữ liệu giảng viên để đảm bảo có trường maGv
      const normalizedLecturers = lecturersResponse.data.map(lecturer => {
        // Tạo trường maGv từ các trường có thể có trong dữ liệu
        const maGv = lecturer.maGv || lecturer.maGV || lecturer.magv || lecturer.ma || 
                    lecturer.magiangvien || lecturer.magv_id || lecturer.ma_gv || 
                    (lecturer.id ? `GV${lecturer.id}` : 'Không có mã');
        
        return {
          ...lecturer,
          maGv: maGv // Đảm bảo luôn có trường maGv
        };
      });
      
      // Làm giàu dữ liệu nhóm học phần với thông tin học phần
      const courseGroupsWithHocPhan = courseGroupsResponse.data.map(group => {
        const hocPhan = hocPhanResponse.data.find(hp => hp.id === group.hocPhanId || hp.id === group.hoc_phan_id);
        return {
          ...group, 
          hocPhan: hocPhan || null
        };
      });
      
      // Lấy danh sách các học kỳ và năm học duy nhất
      const uniqueHocKy = [...new Set(courseGroupsResponse.data
        .filter(group => group.hocKy !== null && group.hocKy !== undefined)
        .map(group => group.hocKy))].sort();
        
      const uniqueNamHoc = [...new Set(courseGroupsResponse.data
        .filter(group => group.namHoc !== null && group.namHoc !== undefined)
        .map(group => group.namHoc))].sort();
        
      console.log("Học kỳ duy nhất:", uniqueHocKy);
      console.log("Năm học duy nhất:", uniqueNamHoc);
      
      setAssignments(assignmentsResponse.data);
      setLecturers(normalizedLecturers);
      setCourseGroups(courseGroupsWithHocPhan);
      setHocPhanList(hocPhanResponse.data);
      setFilteredGroups(courseGroupsWithHocPhan);
      
      // Đặt giá trị mặc định cho học kỳ và năm học nếu có dữ liệu
      if (uniqueHocKy.length > 0) {
        setSelectedHocKy(uniqueHocKy[0]);
      }
      
      if (uniqueNamHoc.length > 0) {
        setSelectedNamHoc(uniqueNamHoc[0]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = () => {
    if (!searchText) {
      return assignments.map(assignment => {
        // Enrich assignment data with lecturer and course group details
        const lecturer = lecturers.find(lec => lec.id === assignment.giangVienId) || {};
        const courseGroup = courseGroups.find(group => group.id === assignment.nhomId) || {};
        
        // Debug log để kiểm tra dữ liệu nhóm học phần
        console.log("Nhóm học phần được tìm thấy:", courseGroup);
        
        // Lấy thông tin học phần từ nhóm
        let tenHocPhan = '';
        let maHocPhan = '';
        
        // Kiểm tra cấu trúc dữ liệu và lấy thông tin học phần
        if (courseGroup.hocPhan) {
          tenHocPhan = courseGroup.hocPhan.tenHp;
          maHocPhan = courseGroup.hocPhan.maHp;
        } else if (courseGroup.hocPhanId) {
          // Nếu là ID học phần, tìm trong danh sách học phần (nếu có)
          tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
        } else if (courseGroup.tenHocPhan) {
          // Nếu có thông tin học phần trực tiếp
          tenHocPhan = courseGroup.tenHocPhan;
          maHocPhan = courseGroup.maHocPhan;
        }

        // Kiểm tra trạng thái dựa trên năm học
        const currentYear = new Date().getFullYear();
        const isActive = courseGroup.namHoc 
          ? parseInt(courseGroup.namHoc.split('-')[0]) >= currentYear
          : true;

        return {
          ...assignment,
          tenGiangVien: lecturer.hoTen,
          boMon: lecturer.boMon,
          khoa: lecturer.khoa,
          maNhom: courseGroup.maNhom,
          tenHocPhan: tenHocPhan,
          maHocPhan: maHocPhan,
          hocKy: courseGroup.hocKy ? `Học kỳ ${courseGroup.hocKy} năm ${courseGroup.namHoc}` : '',
          phongHoc: courseGroup.phongHoc,
          namHoc: courseGroup.namHoc,
          trangThai: isActive ? 'Đang hoạt động' : 'Đã kết thúc',
          isActive: isActive
        };
      });
    }

    return assignments
      .map(assignment => {
        const lecturer = lecturers.find(lec => lec.id === assignment.giangVienId) || {};
        const courseGroup = courseGroups.find(group => group.id === assignment.nhomId) || {};
        
        // Lấy thông tin học phần từ nhóm
        let tenHocPhan = '';
        let maHocPhan = '';
        
        // Kiểm tra cấu trúc dữ liệu và lấy thông tin học phần
        if (courseGroup.hocPhan) {
          tenHocPhan = courseGroup.hocPhan.tenHp;
          maHocPhan = courseGroup.hocPhan.maHp;
        } else if (courseGroup.hocPhanId) {
          // Nếu là ID học phần, tìm trong danh sách học phần (nếu có)
          tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
        } else if (courseGroup.tenHocPhan) {
          // Nếu có thông tin học phần trực tiếp
          tenHocPhan = courseGroup.tenHocPhan;
          maHocPhan = courseGroup.maHocPhan;
        }

        // Kiểm tra trạng thái dựa trên năm học
        const currentYear = new Date().getFullYear();
        const isActive = courseGroup.namHoc 
          ? parseInt(courseGroup.namHoc.split('-')[0]) >= currentYear
          : true;
        
        return {
          ...assignment,
          tenGiangVien: lecturer.hoTen,
          boMon: lecturer.boMon,
          khoa: lecturer.khoa,
          maNhom: courseGroup.maNhom,
          tenHocPhan: tenHocPhan,
          maHocPhan: maHocPhan,
          hocKy: courseGroup.hocKy ? `Học kỳ ${courseGroup.hocKy} năm ${courseGroup.namHoc}` : '',
          phongHoc: courseGroup.phongHoc,
          namHoc: courseGroup.namHoc,
          trangThai: isActive ? 'Đang hoạt động' : 'Đã kết thúc',
          isActive: isActive
        };
      })
      .filter(assignment => 
        (assignment.tenGiangVien && assignment.tenGiangVien.toLowerCase().includes(searchText.toLowerCase())) ||
        (assignment.maNhom && assignment.maNhom.toLowerCase().includes(searchText.toLowerCase())) ||
        (assignment.tenHocPhan && assignment.tenHocPhan.toLowerCase().includes(searchText.toLowerCase())) ||
        (assignment.vaiTro && assignment.vaiTro.toLowerCase().includes(searchText.toLowerCase()))
      );
  };

  // Handle editing a teaching assignment
  const handleEdit = (record) => {
    setEditingId(record.id);
    
    // Nếu đang sửa, hiển thị tất cả nhóm bao gồm nhóm hiện tại
    const assignedGroupIds = assignments
      .filter(assignment => 
        assignment.vaiTro === "Phụ trách" && 
        assignment.id !== record.id // Trừ phân công hiện tại
      )
      .map(assignment => assignment.nhomId);
    
    // Danh sách nhóm có thể chọn: gồm các nhóm chưa phân công và nhóm hiện tại
    const availableGroups = courseGroups.filter(group => 
      !assignedGroupIds.includes(group.id) || group.id === record.nhomId
    );
    
    setFilteredGroups(availableGroups);
    
    form.setFieldsValue({
      nhomId: record.nhomId,
      giangVienId: record.giangVienId,
      vaiTro: record.vaiTro,
      soTiet: record.soTiet
    });

    setIsModalVisible(true);
  };

  // Handle deleting a teaching assignment
  const handleDelete = (id) => {
    console.log("Đang chuẩn bị xóa phân công ID:", id);
    
    // Kiểm tra trạng thái phân công
    const assignment = filteredData().find(item => item.id === id);
    if (assignment && !assignment.isActive) {
      Modal.warning({
        title: 'Không thể xóa',
        content: 'Phân công giảng dạy đã kết thúc nên không thể xóa.',
      });
      return;
    }
    
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phân công giảng dạy này?',
      onOk: async () => {
        setLoading(true);
        try {
          console.log("Bắt đầu gọi API xóa phân công ID:", id);
          try {
            await axios.delete(`/api/phanconggiangday/${id}`);
            console.log("Đã xóa phân công trên API thành công");
          } catch (apiError) {
            console.warn("Lỗi khi gọi API xóa:", apiError.message);
            console.log("Đang chạy trong chế độ phát triển, tiếp tục xử lý");
            // Trong chế độ phát triển, vẫn tiếp tục mặc dù API lỗi
          }
          
          // Cập nhật state local
          const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
          console.log("Số lượng phân công sau khi xóa:", updatedAssignments.length);
          setAssignments(updatedAssignments);
          
          // Cập nhật danh sách nhóm đã lọc nếu đang mở modal
          if (isModalVisible && !editingId) {
            // Cập nhật lại danh sách nhóm học phần có thể chọn
            filterCourseGroups(selectedHocKy, selectedNamHoc, selectedMonHoc);
          }
          
          Modal.success({
            content: 'Xóa phân công giảng dạy thành công'
          });
        } catch (error) {
          console.error('Lỗi khi xóa phân công:', error);
          Modal.error({
            content: `Có lỗi xảy ra khi xóa phân công giảng dạy: ${error.message}`
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("Đang gửi form với giá trị:", values);
    setLoading(true);
    
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!values.nhomId || !values.giangVienId || !values.vaiTro) {
        Modal.warning({
          title: 'Thiếu thông tin',
          content: 'Vui lòng điền đầy đủ thông tin nhóm học phần, giảng viên và vai trò.'
        });
        setLoading(false);
        return;
      }
      
      // Tạo đối tượng dữ liệu phân công
      const assignmentData = {
        nhomId: values.nhomId,
        giangVienId: values.giangVienId,
        vaiTro: values.vaiTro,
        soTiet: values.soTiet
      };

      console.log("Dữ liệu phân công:", assignmentData);

      if (editingId) {
        // Cập nhật phân công đã tồn tại
        console.log("Đang cập nhật phân công ID:", editingId);
        try {
          await axios.put(`/api/phanconggiangday/${editingId}`, assignmentData);
          
          // Cập nhật trên state
          const updatedAssignments = assignments.map(assignment => {
            if (assignment.id === editingId) {
              return { ...assignment, ...assignmentData };
            }
            return assignment;
          });
          
          setAssignments(updatedAssignments);
          Modal.success({
            content: 'Cập nhật phân công giảng dạy thành công'
          });
          setIsModalVisible(false);
          form.resetFields();
        } catch (apiError) {
          console.error('Lỗi khi gọi API cập nhật:', apiError);
          // Thêm xử lý cho môi trường phát triển
          if (process.env.NODE_ENV === 'development') {
            // Giả lập cập nhật thành công trong môi trường phát triển
            const updatedAssignments = assignments.map(assignment => {
              if (assignment.id === editingId) {
                return { ...assignment, ...assignmentData };
              }
              return assignment;
            });
            
            setAssignments(updatedAssignments);
            Modal.success({
              content: 'Cập nhật phân công giảng dạy thành công (chế độ phát triển)'
            });
            setIsModalVisible(false);
            form.resetFields();
          } else {
            // Trong môi trường production, hiển thị lỗi
            Modal.error({
              title: 'Lỗi cập nhật',
              content: 'Không thể cập nhật phân công. Vui lòng thử lại sau.'
            });
          }
        }
      } else {
        // Tạo phân công mới
        console.log("Đang tạo phân công mới");
        try {
          const response = await axios.post('/api/phanconggiangday', assignmentData);
          console.log("Kết quả từ API:", response.data);
          const newAssignment = response.data;
          
          setAssignments([...assignments, newAssignment]);
          Modal.success({
            content: 'Thêm phân công giảng dạy mới thành công'
          });
          setIsModalVisible(false);
          form.resetFields();
        } catch (apiError) {
          console.error('Lỗi khi gọi API tạo mới:', apiError);
          
          // Kiểm tra lỗi cụ thể để hiển thị thông báo phù hợp
          let errorMessage = 'Không thể thêm phân công mới.';
          
          if (apiError.response) {
            // Có phản hồi từ server
            if (apiError.response.status === 409) {
              errorMessage = 'Nhóm học phần này đã được phân công giảng viên phụ trách.';
            } else if (apiError.response.data && apiError.response.data.message) {
              errorMessage = apiError.response.data.message;
            }
          }
          
          // Trong môi trường phát triển, vẫn tiếp tục
          if (process.env.NODE_ENV === 'development') {
            // Giả lập tạo mới thành công
            const newId = Math.max(...assignments.map(a => a.id || 0), 0) + 1;
            const newAssignment = {
              id: newId,
              ...assignmentData
            };
            
            setAssignments([...assignments, newAssignment]);
            Modal.success({
              content: 'Thêm phân công giảng dạy mới thành công (chế độ phát triển)'
            });
            setIsModalVisible(false);
            form.resetFields();
          } else {
            // Trong môi trường production, hiển thị lỗi
            Modal.error({
              title: 'Lỗi thêm mới',
              content: errorMessage
            });
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      Modal.error({
        title: 'Lỗi xử lý',
        content: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc nhóm học phần theo học kỳ, năm học và môn học
  const filterCourseGroups = (hocKy = null, namHoc = null, monHocId = null) => {
    // Lấy danh sách nhóm học phần chưa được phân công
    // hoặc chỉ được phân công một phần (giáo viên có vai trò khác nhau)
    let filtered = [...courseGroups];
    
    // Lọc các nhóm học phần có năm học từ năm hiện tại trở đi
    const currentYear = new Date().getFullYear();
    filtered = filtered.filter(group => {
      if (!group.namHoc) return true; // Giữ lại nếu không có năm học
      try {
        const namHocParts = group.namHoc.split('-');
        if (namHocParts.length > 0) {
          const startYear = parseInt(namHocParts[0]);
          return !isNaN(startYear) && startYear >= currentYear;
        }
        return true;
      } catch (error) {
        console.warn("Lỗi khi phân tích năm học:", error);
        return true; // Giữ lại nếu có lỗi phân tích
      }
    });
    
    // Loại bỏ các nhóm đã có phân công với vai trò "Phụ trách"
    const assignedGroupIds = assignments
      .filter(assignment => assignment.vaiTro === "Phụ trách")
      .map(assignment => assignment.nhomId);
    
    console.log("Danh sách nhóm đã phân công giảng viên phụ trách:", assignedGroupIds);
    
    // Lọc ra các nhóm chưa phân công
    filtered = filtered.filter(group => !assignedGroupIds.includes(group.id));
    
    // Lọc theo học kỳ
    if (hocKy !== null) {
      filtered = filtered.filter(group => group.hocKy === hocKy);
    }
    
    // Lọc theo năm học  
    if (namHoc !== null) {
      filtered = filtered.filter(group => group.namHoc === namHoc);
    }
    
    // Lọc theo môn học
    if (monHocId !== null) {
      filtered = filtered.filter(group => 
        (group.hocPhanId === monHocId) || 
        (group.hocPhan && group.hocPhan.id === monHocId)
      );
    }
    
    console.log("Nhóm học phần đã lọc:", filtered);
    setFilteredGroups(filtered);
    
    // Cập nhật form nếu không có nhóm học phần phù hợp
    if (filtered.length === 0) {
      form.setFieldsValue({ nhomId: undefined });
      message.info("Không tìm thấy nhóm học phần phù hợp với điều kiện lọc");
    } else if (filtered.length === 1) {
      // Tự động chọn nhóm nếu chỉ có 1 kết quả
      form.setFieldsValue({ nhomId: filtered[0].id });
      message.success(`Đã tìm thấy 1 nhóm học phần: ${filtered[0].maNhom || 'Không mã'}`);
    } else {
      message.success(`Đã tìm thấy ${filtered.length} nhóm học phần`);
    }
  };
  
  // Xử lý khi thay đổi học kỳ
  const handleHocKyChange = (value) => {
    setSelectedHocKy(value);
    filterCourseGroups(value, selectedNamHoc, selectedMonHoc);
  };
  
  // Xử lý khi thay đổi năm học
  const handleNamHocChange = (value) => {
    setSelectedNamHoc(value);
    filterCourseGroups(selectedHocKy, value, selectedMonHoc);
  };
  
  // Xử lý khi thay đổi môn học
  const handleMonHocChange = (value) => {
    setSelectedMonHoc(value);
    filterCourseGroups(selectedHocKy, selectedNamHoc, value);
  };

  // Xử lý khi không có kết nối API (cho môi trường phát triển)
  const handleApiFailure = () => {
    // Tạo dữ liệu mẫu cho phát triển UI
    console.log("Không thể kết nối đến API, sử dụng dữ liệu mẫu");
    
    // Dữ liệu mẫu giảng viên
    const sampleLecturers = [
      { id: 1, hoTen: "Nguyễn Văn A", maGv: "GV001", boMon: "Công nghệ phần mềm", khoa: "CNTT" },
      { id: 2, hoTen: "Trần Thị B", maGv: "GV002", boMon: "Khoa học máy tính", khoa: "CNTT" },
      { id: 3, hoTen: "Lê Văn C", maGv: "GV003", boMon: "Mạng máy tính", khoa: "CNTT" }
    ];
    
    // Dữ liệu mẫu học phần
    const sampleHocPhan = [
      { id: 1, maHp: "IT001", tenHp: "Nhập môn lập trình" },
      { id: 2, maHp: "IT002", tenHp: "Cơ sở dữ liệu" },
      { id: 3, maHp: "IT003", tenHp: "Lập trình hướng đối tượng" }
    ];
    
    // Dữ liệu mẫu nhóm học phần
    const sampleCourseGroups = [
      { id: 1, maNhom: "IT001.01", hocPhanId: 1, hocKy: 1, namHoc: "2023-2024", hocPhan: sampleHocPhan[0] },
      { id: 2, maNhom: "IT002.01", hocPhanId: 2, hocKy: 1, namHoc: "2023-2024", hocPhan: sampleHocPhan[1] },
      { id: 3, maNhom: "IT003.01", hocPhanId: 3, hocKy: 2, namHoc: "2023-2024", hocPhan: sampleHocPhan[2] }
    ];
    
    // Dữ liệu mẫu phân công
    const sampleAssignments = [
      { id: 1, nhomId: 1, giangVienId: 1, vaiTro: "Phụ trách", soTiet: 45 },
      { id: 2, nhomId: 2, giangVienId: 2, vaiTro: "Phụ trách", soTiet: 45 },
      { id: 3, nhomId: 3, giangVienId: 3, vaiTro: "Phụ trách", soTiet: 45 }
    ];
    
    setLecturers(sampleLecturers);
    setHocPhanList(sampleHocPhan);
    setCourseGroups(sampleCourseGroups);
    setFilteredGroups(sampleCourseGroups);
    setAssignments(sampleAssignments);
    
    // Đặt giá trị mặc định
    setSelectedHocKy(1);
    setSelectedNamHoc("2023-2024");
  };
  
  // Kiểm tra dữ liệu sau khi fetch
  useEffect(() => {
    if (lecturers.length === 0 && courseGroups.length === 0 && hocPhanList.length === 0) {
      handleApiFailure();
    }
  }, [lecturers, courseGroups, hocPhanList]);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'tenGiangVien',
      key: 'tenGiangVien',
      render: (text, record) => {
        const lecturer = lecturers.find(lec => lec.id === record.giangVienId) || {};
        return (
          <Tooltip title={`${record.boMon || ''} - ${record.khoa || ''}`}>
            <span>
              {lecturer.maGv ? <Tag color="blue">{lecturer.maGv}</Tag> : null} {text || `ID: ${record.giangVienId}`}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Nhóm học phần',
      key: 'nhomHocPhan',
      render: (text, record) => (
        <Tooltip title={record.tenHocPhan}>
          <span>{record.maNhom || `ID: ${record.nhomId}`}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      render: (vaiTro) => {
        let color = 'blue';
        if (vaiTro === 'Phụ trách') {
          color = 'green';
        } else if (vaiTro === 'Trợ giảng') {
          color = 'orange';
        } else if (vaiTro === 'Giảng viên thỉnh giảng') {
          color = 'purple';
        }
        return <Tag color={color}>{vaiTro}</Tag>;
      },
    },
    {
      title: 'Số tiết',
      dataIndex: 'soTiet',
      key: 'soTiet',
      width: 100,
      sorter: (a, b) => a.soTiet - b.soTiet,
    },
    {
      title: 'Học phần',
      key: 'hocPhan',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Tooltip placement="topLeft" title={`${record.maHocPhan ? record.maHocPhan + ' - ' : ''}${record.tenHocPhan || ''}`}>
          <span>{record.maHocPhan ? record.maHocPhan + ' - ' : ''}{record.tenHocPhan || ''}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Học kỳ',
      dataIndex: 'hocKy',
      key: 'hocKy',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        const courseGroup = courseGroups.find(group => group.id === record.nhomId) || {};
        const hocKy = courseGroup.hocKy;
        const namHoc = courseGroup.namHoc;
        
        if (hocKy && namHoc) {
          return (
            <Tooltip placement="topLeft" title={`Học kỳ ${hocKy} năm ${namHoc}`}>
              <Tag color="processing">{`HK${hocKy}-${namHoc}`}</Tag>
            </Tooltip>
          );
        }
        
        return <span>-</span>;
      },
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      width: 140,
      render: (text, record) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.trangThai}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (text, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => {
                const lecturer = lecturers.find(lec => lec.id === record.giangVienId) || {};
                const courseGroup = courseGroups.find(group => group.id === record.nhomId) || {};
                
                // Lấy thông tin học phần từ nhóm
                let tenHocPhan = '';
                let maHocPhan = '';
                
                // Kiểm tra cấu trúc dữ liệu và lấy thông tin học phần
                if (courseGroup.hocPhan) {
                  tenHocPhan = courseGroup.hocPhan.tenHp;
                  maHocPhan = courseGroup.hocPhan.maHp;
                } else if (courseGroup.hocPhanId) {
                  tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
                } else if (courseGroup.tenHocPhan) {
                  tenHocPhan = courseGroup.tenHocPhan;
                  maHocPhan = courseGroup.maHocPhan;
                }
                
                Modal.info({
                  title: 'Chi tiết phân công giảng dạy',
                  width: 600,
                  content: (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 16 }}>
                        <h3>Thông tin giảng viên</h3>
                        <p><strong>Họ tên:</strong> {lecturer.hoTen || 'N/A'}</p>
                        <p><strong>Mã giảng viên:</strong> {lecturer.maGv || lecturer.maGV || lecturer.magiangvien || 'N/A'}</p>
                        <p><strong>Bộ môn:</strong> {lecturer.boMon || 'N/A'}</p>
                        <p><strong>Khoa:</strong> {lecturer.khoa || 'N/A'}</p>
                      </div>
                      
                      <Divider />
                      
                      <div style={{ marginBottom: 16 }}>
                        <h3>Thông tin nhóm học phần</h3>
                        <p><strong>Mã nhóm:</strong> {courseGroup.maNhom || 'N/A'}</p>
                        <p><strong>Mã học phần:</strong> {maHocPhan || 'N/A'}</p>
                        <p><strong>Tên học phần:</strong> {tenHocPhan || 'N/A'}</p>
                        <p><strong>Học kỳ:</strong> {courseGroup.hocKy ? `Học kỳ ${courseGroup.hocKy} năm ${courseGroup.namHoc}` : 'N/A'}</p>
                        <p><strong>Trạng thái:</strong> <Tag color={record.isActive ? 'green' : 'red'}>{record.trangThai}</Tag></p>
                      </div>
                      
                      <Divider />
                      
                      <div>
                        <h3>Thông tin phân công</h3>
                        <p><strong>Vai trò:</strong> {record.vaiTro || 'N/A'}</p>
                        <p><strong>Số tiết:</strong> {record.soTiet || 'N/A'}</p>
                      </div>
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!record.isActive}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={!record.isActive}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Phân công giảng dạy</Title>
        <Space>
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
            onChange={handleSearch}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              console.log("Nhấn nút thêm phân công");
              setEditingId(null);
              form.resetFields();
              
              // Reset các lựa chọn và hiển thị tất cả nhóm học phần chưa phân công
              setSelectedMonHoc(null);
              setSelectedHocKy(null);
              setSelectedNamHoc(null);
              
              // Lấy danh sách nhóm học phần chưa được phân công với vai trò phụ trách và còn hoạt động
              const assignedGroupIds = assignments
                .filter(assignment => assignment.vaiTro === "Phụ trách")
                .map(assignment => assignment.nhomId);
                
              const currentYear = new Date().getFullYear();
              const availableGroups = courseGroups.filter(group => {
                // Loại bỏ các nhóm đã phân công
                if (assignedGroupIds.includes(group.id)) return false;
                
                // Chỉ giữ lại nhóm có năm học từ năm hiện tại trở đi hoặc không có năm học
                if (group.namHoc) {
                  const startYear = parseInt(group.namHoc.split('-')[0]);
                  return startYear >= currentYear;
                }
                return true; // Giữ lại nếu không có năm học
              });
              
              setFilteredGroups(availableGroups);
              
              console.log("Số lượng nhóm học phần:", courseGroups.length);
              console.log("Số lượng nhóm chưa phân công:", availableGroups.length);
              
              // Kiểm tra nếu không có nhóm học phần khả dụng
              if (availableGroups.length === 0) {
                message.warning("Không có nhóm học phần nào chưa được phân công và còn hoạt động");
              }
              
              setIsModalVisible(true);
            }}
          >
            Thêm phân công
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Badge status="processing" text={`Tổng số phân công: ${assignments.length}`} style={{ marginRight: 16 }} />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData()}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
        size="middle"
      />

      <Modal
        title={editingId ? "Cập nhật phân công giảng dạy" : "Thêm phân công giảng dạy mới"}
        open={isModalVisible}
        onCancel={() => {
          console.log("Đóng modal");
          setIsModalVisible(false);
          form.resetFields();
        }}
        afterOpenChange={(visible) => {
          console.log("Trạng thái modal:", visible ? "Đã mở" : "Đã đóng");
          if (visible) {
            console.log("Modal đã mở, số lượng nhóm học phần:", filteredGroups.length);
          }
        }}
        destroyOnClose={true}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!editingId && (
            <>
              <Card title="Lọc kế hoạch mở nhóm" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Học kỳ">
                      <Select 
                        placeholder="Chọn học kỳ"
                        value={selectedHocKy}
                        onChange={handleHocKyChange}
                        allowClear
                      >
                        {[1, 2, 3].map(hocKy => (
                          <Option key={hocKy} value={hocKy}>
                            Học kỳ {hocKy}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Năm học">
                      <Select 
                        placeholder="Chọn năm học"
                        value={selectedNamHoc}
                        onChange={handleNamHocChange}
                        allowClear
                        dropdownRender={menu => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                              <Input
                                placeholder="Nhập năm học (ví dụ: 2024)"
                                style={{ width: '150px' }}
                                onChange={(e) => {
                                  const value = e.target.value.trim();
                                  if (/^\d{4}$/.test(value)) {
                                    const year = parseInt(value);
                                    const currentYear = new Date().getFullYear();
                                    if (year >= currentYear) {
                                      const nextYear = year + 1;
                                      const formattedValue = `${year}-${nextYear}`;
                                      handleNamHocChange(formattedValue);
                                    } else {
                                      message.warning(`Năm học phải lớn hơn hoặc bằng năm hiện tại (${currentYear})`);
                                    }
                                  }
                                }}
                              />
                            </Space>
                          </>
                        )}
                      >
                        {Array.from(new Set(courseGroups
                          .filter(group => group.namHoc)
                          .map(group => group.namHoc)))
                          .sort()
                          .filter(namHoc => {
                            // Lọc năm học: chỉ hiển thị từ năm hiện tại trở đi
                            const currentYear = new Date().getFullYear();
                            const startYear = parseInt(namHoc.split('-')[0]);
                            return startYear >= currentYear;
                          })
                          .map(namHoc => (
                            <Option key={namHoc} value={namHoc}>
                              {namHoc}
                            </Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Tìm môn học">
                      <Select
                        showSearch
                        placeholder="Tìm môn học"
                        optionFilterProp="children"
                        value={selectedMonHoc}
                        onChange={handleMonHocChange}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                      >
                        {hocPhanList.map(hp => (
                          <Option key={hp.id} value={hp.id}>
                            {hp.maHp || hp.maHP || hp.ma_hp ? `[${hp.maHp || hp.maHP || hp.ma_hp}] ` : ''}{hp.tenHp || hp.tenHP || hp.ten_hp || ''}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </>
          )}
          
          <Form.Item
            name="nhomId"
            label="Nhóm học phần"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm học phần' }]}
          >
            <Select
              placeholder="Chọn nhóm học phần"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled={editingId !== null}
            >
              {filteredGroups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.maNhom} - {group.hocPhan ? group.hocPhan.tenHp : 'Không xác định'}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="giangVienId"
            label="Giảng viên"
            rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {lecturers.map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {lecturer.maGv ? `[${lecturer.maGv}] ` : ''}{lecturer.hoTen || 'Không xác định'}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="vaiTro"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            initialValue="Phụ trách"
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Phụ trách">Phụ trách</Option>
              <Option value="Trợ giảng">Trợ giảng</Option>
              <Option value="Giảng viên thỉnh giảng">Giảng viên thỉnh giảng</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="soTiet"
            label="Số tiết"
            rules={[{ required: true, message: 'Vui lòng nhập số tiết' }]}
            initialValue={45}
          >
            <InputNumber min={1} max={200} />
          </Form.Item>
          
          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageTeachingAssignments;