import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Badge, Divider, Row, Col } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, FileExcelOutlined } from '@ant-design/icons';
import axios from 'axios';
import { message } from 'antd';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Cấu hình baseURL cho axios
axios.defaults.baseURL = 'http://localhost:8080';  // Thay đổi URL này thành server API của bạn

// Thêm timeout để tránh chờ quá lâu
axios.defaults.timeout = 10000; // 10 giây

const { Title } = Typography;
const { Option } = Select;

const ManageTeachingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courseGroups, setCourseGroups] = useState([]);
  const [hocPhanList, setHocPhanList] = useState([]);
  const [filteredHocPhanList, setFilteredHocPhanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false); // Thêm state cho modal xuất Excel
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedHocKy, setSelectedHocKy] = useState(null);
  const [selectedNamHoc, setSelectedNamHoc] = useState(null);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [selectedExportYear, setSelectedExportYear] = useState(null); // Thêm state cho năm học xuất Excel
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [form] = Form.useForm();
  const [exportForm] = Form.useForm(); // Thêm form cho modal xuất Excel

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
        console.log("Dữ liệu phân công gốc:", assignmentsResponse.data);
        
        // Chuẩn hóa tên trường
        if (assignmentsResponse.data.length > 0) {
          const firstItem = assignmentsResponse.data[0];
          // Kiểm tra cấu trúc dữ liệu
          if (firstItem.nhom_id && !firstItem.nhomId) {
            // Chuyển đổi snake_case sang camelCase
            assignmentsResponse.data = assignmentsResponse.data.map(item => ({
              id: item.id,
              nhomId: item.nhom_id,
              giangVienId: item.giang_vien_id,
              vaiTro: item.vai_tro === "Giảng viên chính" ? "Phụ trách" : item.vai_tro,
              soTiet: item.so_tiet
            }));
          }
        }
      } catch (err) {
        console.warn('Không thể lấy dữ liệu phân công:', err.message);
        assignmentsResponse = { data: [] };
      }
      
      try {
        lecturersResponse = await axios.get('/api/giangvien');
        // Chuẩn hóa tên trường nếu cần
        if (lecturersResponse.data.length > 0) {
          const firstItem = lecturersResponse.data[0];
          console.log("Cấu trúc dữ liệu giảng viên gốc:", firstItem);
          
          if (firstItem.ma_gv && !firstItem.maGv) {
            lecturersResponse.data = lecturersResponse.data.map(item => ({
              id: item.id,
              hoTen: item.ho_ten || item.ten,
              maGv: item.ma_gv,
              boMon: item.bo_mon,
              khoa: item.khoa
            }));
          } else {
            // Đảm bảo tất cả giảng viên đều có trường maGv được chuẩn hóa
            lecturersResponse.data = lecturersResponse.data.map(item => ({
              ...item,
              maGv: item.maGv || item.maGV || item.ma_gv || item.magv || 
                   item.magiangvien || item.ma_giang_vien || item.maGiangVien || ''
            }));
          }
          
          // Log một vài mẫu giảng viên để kiểm tra
          console.log("Mẫu giảng viên sau khi chuẩn hóa:", lecturersResponse.data.slice(0, 2));
        }
      } catch (err) {
        console.warn('Không thể lấy dữ liệu giảng viên:', err.message);
        lecturersResponse = { data: [] };
      }
      
      try {
        courseGroupsResponse = await axios.get('/api/kehoachmonhom');
        // Chuẩn hóa tên trường nếu cần
        if (courseGroupsResponse.data.length > 0) {
          const firstItem = courseGroupsResponse.data[0];
          if (firstItem.hoc_phan_id && !firstItem.hocPhanId) {
            courseGroupsResponse.data = courseGroupsResponse.data.map(item => ({
              id: item.id,
              maNhom: item.ma_nhom,
              hocPhanId: item.hoc_phan_id,
              hocKy: item.hoc_ky,
              namHoc: item.nam_hoc,
              phongHoc: item.phong_hoc
            }));
          }
        }
      } catch (err) {
        console.warn('Không thể lấy dữ liệu kế hoạch mở nhóm:', err.message);
        courseGroupsResponse = { data: [] };
      }
      
      try {
        hocPhanResponse = await axios.get('/api/hocphan');
        // Chuẩn hóa tên trường nếu cần
        if (hocPhanResponse.data.length > 0) {
          const firstItem = hocPhanResponse.data[0];
          if (firstItem.ma_hp && !firstItem.maHp) {
            hocPhanResponse.data = hocPhanResponse.data.map(item => ({
              id: item.id,
              maHp: item.ma_hp,
              tenHp: item.ten_hp
            }));
          }
        }
      } catch (err) {
        console.warn('Không thể lấy dữ liệu học phần:', err.message);
        hocPhanResponse = { data: [] };
      }
      
      console.log("Phân công đã chuẩn hóa:", assignmentsResponse.data);
      console.log("Giảng viên đã chuẩn hóa:", lecturersResponse.data);
      
      // Kiểm tra cấu trúc dữ liệu giảng viên để xác định tên trường chứa mã giảng viên
      if (lecturersResponse.data.length > 0) {
        const firstLecturer = lecturersResponse.data[0];
        console.log("Cấu trúc dữ liệu giảng viên:", Object.keys(firstLecturer));
      }
      
      console.log("Nhóm học phần:", courseGroupsResponse.data);
      console.log("Học phần:", hocPhanResponse.data);
      
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
      setLecturers(lecturersResponse.data);
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
    // Đảm bảo chúng ta có dữ liệu
    if (!assignments || assignments.length === 0) {
      console.log("Không có dữ liệu phân công");
      return [];
    }
    
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
          const hocPhan = hocPhanList.find(hp => hp.id === courseGroup.hocPhanId);
          if (hocPhan) {
            tenHocPhan = hocPhan.tenHp;
            maHocPhan = hocPhan.maHp;
          } else {
            tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
          }
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

        // Chuẩn hóa vai trò
        let vaiTro = assignment.vaiTro;
        if (vaiTro === "Giảng viên chính") {
          vaiTro = "Phụ trách";
        }

        return {
          ...assignment,
          vaiTro: vaiTro,
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
          const hocPhan = hocPhanList.find(hp => hp.id === courseGroup.hocPhanId);
          if (hocPhan) {
            tenHocPhan = hocPhan.tenHp;
            maHocPhan = hocPhan.maHp;
          } else {
            tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
          }
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
        
        // Chuẩn hóa vai trò
        let vaiTro = assignment.vaiTro;
        if (vaiTro === "Giảng viên chính") {
          vaiTro = "Phụ trách";
        }
        
        return {
          ...assignment,
          vaiTro: vaiTro,
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
          
          // Gọi API để xóa phân công
          await axios.delete(`/api/phanconggiangday/${id}`);
          console.log("Đã xóa phân công trên API thành công");
          
          // Chỉ cập nhật state local sau khi API thành công
          const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
          console.log("Số lượng phân công sau khi xóa:", updatedAssignments.length);
          setAssignments(updatedAssignments);
          
          // Cập nhật danh sách nhóm đã lọc nếu đang mở modal
          if (isModalVisible && !editingId) {
            // Cập nhật lại danh sách nhóm học phần có thể chọn
            filterCourseGroups(selectedHocKy, selectedNamHoc, selectedMonHoc);
          }
          
          message.success('Xóa phân công giảng dạy thành công');
        } catch (error) {
          console.error('Lỗi khi xóa phân công:', error);
          message.error(`Không thể xóa phân công từ cơ sở dữ liệu: ${error.message}`);
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
      
      // Kiểm tra xem nhóm học phần đã có giảng viên phụ trách chưa
      const selectedGroup = filteredGroups.find(g => g.id === values.nhomId);
      if (!editingId && selectedGroup && selectedGroup.isAssigned && values.vaiTro === 'Phụ trách') {
        // Nếu đã có giảng viên phụ trách và đang thêm mới với vai trò phụ trách
        const assignment = selectedGroup.assignmentInfo;
        const lecturer = lecturers.find(l => l.id === assignment?.giangVienId);
        
        Modal.error({
          title: 'Không thể thêm mới',
          content: (
            <div>
              <p>Nhóm học phần này đã được phân công cho giảng viên phụ trách:</p>
              <p><strong>Giảng viên:</strong> {lecturer?.hoTen || 'Không xác định'}</p>
              <p>Mỗi nhóm học phần chỉ có thể có một giảng viên với vai trò "Phụ trách".</p>
              <p>Vui lòng chọn vai trò khác (Trợ giảng, Giảng viên thỉnh giảng) hoặc chọn nhóm học phần khác.</p>
            </div>
          )
        });
        setLoading(false);
        return;
      }
      
      // Tạo đối tượng dữ liệu phân công
      let assignmentData = {
        nhomId: values.nhomId,
        giangVienId: values.giangVienId,
        vaiTro: values.vaiTro,
        soTiet: values.soTiet
      };

      // Kiểm tra nếu cần chuyển đổi sang snake_case
      const firstAssignment = assignments[0];
      if (firstAssignment && 'nhom_id' in firstAssignment) {
        // Chuyển đổi sang snake_case
        assignmentData = {
          nhom_id: values.nhomId,
          giang_vien_id: values.giangVienId,
          vai_tro: values.vaiTro,
          so_tiet: values.soTiet
        };
      }

      console.log("Dữ liệu phân công sẽ gửi lên server:", assignmentData);

      let apiResponse;
      
      if (editingId) {
        // Cập nhật phân công đã tồn tại
        console.log("Đang cập nhật phân công ID:", editingId);
        apiResponse = await axios.put(`/api/phanconggiangday/${editingId}`, assignmentData);
        console.log("Kết quả cập nhật từ API:", apiResponse.data);
        
        // Cập nhật trên state
        const updatedAssignments = assignments.map(assignment => {
          if (assignment.id === editingId) {
            return { ...assignment, ...assignmentData, id: editingId };
          }
          return assignment;
        });
        
        setAssignments(updatedAssignments);
        message.success('Cập nhật phân công giảng dạy thành công');
      } else {
        // Tạo phân công mới
        console.log("Đang tạo phân công mới");
        apiResponse = await axios.post('/api/phanconggiangday', assignmentData);
        console.log("Kết quả từ API:", apiResponse.data);
        
        // Lấy thông tin phân công mới từ API response
        const newAssignment = apiResponse.data;
        
        // Thêm vào state
        setAssignments([...assignments, newAssignment]);
        message.success('Thêm phân công giảng dạy mới thành công');
      }
      
      // Đóng form và reset
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      
      let errorMessage = 'Có lỗi xảy ra trong quá trình lưu dữ liệu.';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Nhóm học phần này đã được phân công giảng viên phụ trách.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      Modal.error({
        title: editingId ? 'Lỗi cập nhật' : 'Lỗi thêm mới',
        content: errorMessage
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
    
    // Lấy danh sách các nhóm đã có phân công với vai trò "Phụ trách" hoặc "Giảng viên chính"
    const assignedGroupIds = assignments
      .filter(assignment => 
        assignment.vaiTro === "Phụ trách" || 
        assignment.vaiTro === "Giảng viên chính"
      )
      .map(assignment => assignment.nhomId);
    
    console.log("Danh sách nhóm đã phân công giảng viên phụ trách:", assignedGroupIds);
    
    // Đánh dấu các nhóm đã phân công thay vì loại bỏ chúng
    filtered = filtered.map(group => ({
      ...group,
      isAssigned: assignedGroupIds.includes(group.id),
      assignmentInfo: assignments.find(a => a.nhomId === group.id && a.vaiTro === "Phụ trách")
    }));
    
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
    } else if (filtered.length === 1 && !filtered[0].isAssigned) {
      // Tự động chọn nhóm nếu chỉ có 1 kết quả và chưa được phân công
      form.setFieldsValue({ nhomId: filtered[0].id });
      message.success(`Đã tìm thấy 1 nhóm học phần: ${filtered[0].maNhom || 'Không mã'}`);
    } else {
      const availableCount = filtered.filter(group => !group.isAssigned).length;
      const assignedCount = filtered.length - availableCount;
      
      if (availableCount > 0) {
        message.success(`Đã tìm thấy ${filtered.length} nhóm học phần (${availableCount} chưa phân công, ${assignedCount} đã phân công)`);
      } else if (assignedCount > 0) {
        message.warning(`Tìm thấy ${assignedCount} nhóm học phần đã được phân công giảng viên phụ trách`);
      }
    }
  };
  
  // Xử lý khi thay đổi học kỳ
  const handleHocKyChange = (value) => {
    setSelectedHocKy(value);
    filterCourseGroups(value, selectedNamHoc, selectedMonHoc);
    // Cập nhật danh sách học phần dựa trên học kỳ và năm học
    updateFilteredHocPhanList(value, selectedNamHoc);
  };
  
  // Xử lý khi thay đổi năm học
  const handleNamHocChange = (value) => {
    setSelectedNamHoc(value);
    filterCourseGroups(selectedHocKy, value, selectedMonHoc);
    // Cập nhật danh sách học phần dựa trên học kỳ và năm học
    updateFilteredHocPhanList(selectedHocKy, value);
  };
  
  // Hàm cập nhật danh sách học phần dựa trên học kỳ và năm học đã chọn
  const updateFilteredHocPhanList = (hocKy, namHoc) => {
    try {
      if (!hocKy && !namHoc) {
        // Nếu không chọn học kỳ và năm học, hiển thị tất cả học phần
        setFilteredHocPhanList(hocPhanList);
        return;
      }

      // Lọc danh sách nhóm học phần theo học kỳ và năm học
      const filteredNhomHocPhan = courseGroups.filter(group => {
        let matchHocKy = true;
        let matchNamHoc = true;
        
        if (hocKy !== null) {
          matchHocKy = group.hocKy === hocKy;
        }
        
        if (namHoc !== null) {
          matchNamHoc = group.namHoc === namHoc;
        }
        
        return matchHocKy && matchNamHoc;
      });
      
      // Lấy danh sách id học phần duy nhất từ các nhóm đã lọc
      const hocPhanIds = [...new Set(filteredNhomHocPhan
        .filter(group => group.hocPhanId || (group.hocPhan && group.hocPhan.id))
        .map(group => group.hocPhanId || (group.hocPhan && group.hocPhan.id)))];
      
      // Lọc danh sách học phần theo các id đã tìm được
      const filteredHocPhan = hocPhanList.filter(hp => hocPhanIds.includes(hp.id));
      
      console.log(`Đã lọc được ${filteredHocPhan.length} học phần thuộc học kỳ ${hocKy}, năm học ${namHoc}`);
      setFilteredHocPhanList(filteredHocPhan);
      
      // Nếu đang chọn một môn học không thuộc danh sách đã lọc, reset giá trị
      if (selectedMonHoc && !hocPhanIds.includes(selectedMonHoc)) {
        setSelectedMonHoc(null);
      }
    } catch (error) {
      console.error('Lỗi khi lọc danh sách học phần:', error);
      message.error('Có lỗi xảy ra khi lọc danh sách học phần');
      // Trong trường hợp lỗi, hiển thị tất cả học phần
      setFilteredHocPhanList(hocPhanList);
    }
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

  // Thêm đoạn code khởi tạo danh sách học phần lọc ban đầu
  useEffect(() => {
    if (hocPhanList.length > 0) {
      setFilteredHocPhanList(hocPhanList);
    }
  }, [hocPhanList]);

  // Thêm hàm xuất Excel - sửa lại phần cột Excel và thêm lọc theo năm học
  const exportToExcel = async (namHoc) => {
    setLoading(true);

    try {
      // Tạo workbook mới
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Phân công giảng dạy');

      // Thêm tiêu đề
      worksheet.mergeCells('A1:N1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = `PHÂN CÔNG GIẢNG DẠY ${namHoc ? `NĂM HỌC ${namHoc}` : ''}`;
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: 'center' };
      
      // Thiết lập header cho bảng
      const headers = [
        'STT', 'Mã HP', 'Tên học phần', 'Số TC', 'Khóa', 
        'LT', 'BT', 'TH', 'TC', 'Hệ số HP', 'Tổng Số nhóm', 'SLSV/Nhóm', 
        'Nhóm', 'Mã CBGD', 'Họ và tên CBGD', 'Số tiết thực hiện', 'Số tiết thực tế'
      ];
      
      // Header chính
      worksheet.mergeCells('A3:A4');
      worksheet.mergeCells('B3:B4');
      worksheet.mergeCells('C3:C4');
      worksheet.mergeCells('D3:D4');
      worksheet.mergeCells('E3:E4');
      worksheet.mergeCells('F3:I3');
      worksheet.mergeCells('J3:J4');
      worksheet.mergeCells('K3:K4');
      worksheet.mergeCells('L3:L4');
      worksheet.mergeCells('M3:M4');
      worksheet.mergeCells('N3:N4');
      worksheet.mergeCells('O3:O4');
      worksheet.mergeCells('P3:P4');
      worksheet.mergeCells('Q3:Q4');
      
      worksheet.getCell('A3').value = 'STT';
      worksheet.getCell('B3').value = 'Mã HP';
      worksheet.getCell('C3').value = 'Tên học phần';
      worksheet.getCell('D3').value = 'Số TC';
      worksheet.getCell('E3').value = 'Khóa';
      worksheet.getCell('F3').value = 'Số tiết';
      worksheet.getCell('J3').value = 'Hệ số HP';
      worksheet.getCell('K3').value = 'Tổng Số nhóm';
      worksheet.getCell('L3').value = 'SLSV/Nhóm';
      worksheet.getCell('M3').value = 'Nhóm';
      worksheet.getCell('N3').value = 'Mã CBGD';
      worksheet.getCell('O3').value = 'Họ và tên CBGD';
      worksheet.getCell('P3').value = 'Số tiết thực hiện';
      worksheet.getCell('Q3').value = 'Số tiết thực tế';
      
      // Sub-header cho cột "Số tiết"
      worksheet.getCell('F4').value = 'LT';
      worksheet.getCell('G4').value = 'BT';
      worksheet.getCell('H4').value = 'TH';
      worksheet.getCell('I4').value = 'TC';
      
      // Áp dụng style cho header
      ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'J3', 'K3', 'L3', 'M3', 'N3', 'O3', 'P3', 'Q3', 
       'F4', 'G4', 'H4', 'I4'].forEach(cell => {
        worksheet.getCell(cell).font = { bold: true };
        worksheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell(cell).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' }
        };
        worksheet.getCell(cell).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Thiết lập độ rộng cột
      worksheet.getColumn('A').width = 5;  // STT
      worksheet.getColumn('B').width = 10; // Mã HP
      worksheet.getColumn('C').width = 30; // Tên học phần
      worksheet.getColumn('D').width = 8;  // Số TC
      worksheet.getColumn('E').width = 20; // Khóa
      worksheet.getColumn('F').width = 8;  // LT
      worksheet.getColumn('G').width = 8;  // BT
      worksheet.getColumn('H').width = 8;  // TH
      worksheet.getColumn('I').width = 8;  // TC
      worksheet.getColumn('J').width = 10; // Hệ số HP
      worksheet.getColumn('K').width = 10; // Tổng Số nhóm
      worksheet.getColumn('L').width = 12; // SLSV/Nhóm
      worksheet.getColumn('M').width = 8;  // Nhóm
      worksheet.getColumn('N').width = 12; // Mã CBGD
      worksheet.getColumn('O').width = 25; // Họ và tên CBGD
      worksheet.getColumn('P').width = 15; // Số tiết thực hiện
      worksheet.getColumn('Q').width = 12; // Số tiết thực tế

      // Lấy dữ liệu đã được xử lý
      let data = filteredData();
      
      // Lọc dữ liệu theo năm học nếu có
      if (namHoc) {
        data = data.filter(item => item.namHoc === namHoc);
        
        // Nếu không có dữ liệu sau khi lọc, hiển thị thông báo và dừng xuất
        if (data.length === 0) {
          message.info(`Không có dữ liệu phân công giảng dạy cho năm học ${namHoc}`);
          setLoading(false);
          return;
        }
      }

      // Nhóm dữ liệu theo học phần
      const groupedByHocPhan = {};
      data.forEach(item => {
        const courseGroup = courseGroups.find(g => g.id === item.nhomId) || {};
        const hocPhan = courseGroup.hocPhan || {};
        const maHocPhan = item.maHocPhan || hocPhan.maHp || '';
        
        if (!groupedByHocPhan[maHocPhan]) {
          groupedByHocPhan[maHocPhan] = {
            maHocPhan: maHocPhan,
            tenHocPhan: item.tenHocPhan || hocPhan.tenHp || '',
            soTC: hocPhan.soTc || 3, // Mặc định nếu không có
            khoa: 'CNTT + KTPM+TTNT', // Lấy từ API trong thực tế
            soTietLT: 45,
            soTietBT: 0,
            soTietTH: 30,
            soTietTC: 75,
            heSoHP: 0.8,
            tongSoNhom: 0,
            slsvNhom: 30,
            assignments: []
          };
        }
        
        // Lấy mã giảng viên từ nhiều trường khác nhau
        const lecturer = lecturers.find(l => l.id === item.giangVienId) || {};
        const maCBGD = lecturer.maGiangVien || lecturer.maGv || lecturer.maGV || 
                     lecturer.ma_gv || lecturer.magv || lecturer.magiangvien || '';
        
        // Thêm phân công giảng dạy vào học phần
        groupedByHocPhan[maHocPhan].assignments.push({
          ...item,
          nhom: courseGroup.maNhom || '',
          maCBGD: maCBGD, // Đã cập nhật để nhận dạng đúng mã giảng viên
          tenCBGD: item.tenGiangVien || '',
          soTietThucHien: item.soTiet || 0,
          soTietThucTe: item.soTiet || 0 // Mặc định bằng số tiết thực hiện
        });
        
        // Cập nhật số nhóm
        groupedByHocPhan[maHocPhan].tongSoNhom = groupedByHocPhan[maHocPhan].assignments.length;
      });

      // Thêm dữ liệu vào worksheet
      let rowIndex = 5;
      let stt = 1;
      
      // Duyệt qua từng học phần và thêm dữ liệu
      Object.values(groupedByHocPhan).forEach(hocPhan => {
        const firstRow = rowIndex;
        const lastRow = rowIndex + hocPhan.assignments.length - 1;
        
        // Merge các cột cho thông tin học phần
        if (hocPhan.assignments.length > 1) {
          worksheet.mergeCells(`A${firstRow}:A${lastRow}`);
          worksheet.mergeCells(`B${firstRow}:B${lastRow}`);
          worksheet.mergeCells(`C${firstRow}:C${lastRow}`);
          worksheet.mergeCells(`D${firstRow}:D${lastRow}`);
          worksheet.mergeCells(`E${firstRow}:E${lastRow}`);
          worksheet.mergeCells(`F${firstRow}:F${lastRow}`);
          worksheet.mergeCells(`G${firstRow}:G${lastRow}`);
          worksheet.mergeCells(`H${firstRow}:H${lastRow}`);
          worksheet.mergeCells(`I${firstRow}:I${lastRow}`);
          worksheet.mergeCells(`J${firstRow}:J${lastRow}`);
          worksheet.mergeCells(`K${firstRow}:K${lastRow}`);
          worksheet.mergeCells(`L${firstRow}:L${lastRow}`);
        }
        
        // Thông tin học phần
        worksheet.getCell(`A${firstRow}`).value = stt++;
        worksheet.getCell(`B${firstRow}`).value = hocPhan.maHocPhan;
        worksheet.getCell(`C${firstRow}`).value = hocPhan.tenHocPhan;
        worksheet.getCell(`D${firstRow}`).value = hocPhan.soTC;
        worksheet.getCell(`E${firstRow}`).value = hocPhan.khoa;
        worksheet.getCell(`F${firstRow}`).value = hocPhan.soTietLT;
        worksheet.getCell(`G${firstRow}`).value = hocPhan.soTietBT;
        worksheet.getCell(`H${firstRow}`).value = hocPhan.soTietTH;
        worksheet.getCell(`I${firstRow}`).value = hocPhan.soTietTC;
        worksheet.getCell(`J${firstRow}`).value = hocPhan.heSoHP;
        worksheet.getCell(`K${firstRow}`).value = hocPhan.tongSoNhom;
        worksheet.getCell(`L${firstRow}`).value = hocPhan.slsvNhom;
        
        // Tạo border cho các cột đã merge
        if (hocPhan.assignments.length > 1) {
          [`A${firstRow}`, `B${firstRow}`, `C${firstRow}`, `D${firstRow}`, `E${firstRow}`, 
           `F${firstRow}`, `G${firstRow}`, `H${firstRow}`, `I${firstRow}`, `J${firstRow}`, 
           `K${firstRow}`, `L${firstRow}`].forEach(cell => {
            worksheet.getCell(cell).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
          });
        }
        
        // Thông tin phân công cho từng giảng viên
        hocPhan.assignments.forEach((assignment, index) => {
          const currentRow = firstRow + index;
          
          worksheet.getCell(`M${currentRow}`).value = assignment.nhom;
          worksheet.getCell(`N${currentRow}`).value = assignment.maCBGD;
          worksheet.getCell(`O${currentRow}`).value = assignment.tenCBGD;
          worksheet.getCell(`P${currentRow}`).value = assignment.soTietThucHien;
          worksheet.getCell(`Q${currentRow}`).value = assignment.soTietThucTe;
          
          // Tạo border cho từng cell
          [`A${currentRow}`, `B${currentRow}`, `C${currentRow}`, `D${currentRow}`, 
           `E${currentRow}`, `F${currentRow}`, `G${currentRow}`, `H${currentRow}`, 
           `I${currentRow}`, `J${currentRow}`, `K${currentRow}`, `L${currentRow}`, 
           `M${currentRow}`, `N${currentRow}`, `O${currentRow}`, `P${currentRow}`, 
           `Q${currentRow}`].forEach(cell => {
            worksheet.getCell(cell).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            worksheet.getCell(cell).alignment = { vertical: 'middle' };
          });
          
          // Căn giữa cho một số cột
          [`A${currentRow}`, `B${currentRow}`, `D${currentRow}`, `F${currentRow}`, 
           `G${currentRow}`, `H${currentRow}`, `I${currentRow}`, `J${currentRow}`, 
           `K${currentRow}`, `L${currentRow}`, `M${currentRow}`, `N${currentRow}`, `P${currentRow}`, 
           `Q${currentRow}`].forEach(cell => {
            worksheet.getCell(cell).alignment.horizontal = 'center';
          });
        });
        
        rowIndex += hocPhan.assignments.length;
      });

      // Tạo buffer để lưu file
      const buffer = await workbook.xlsx.writeBuffer();
      
      // Tạo blob và lưu file
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `PhanCongGiangDay${namHoc ? `_${namHoc}` : ''}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`);
      
      message.success('Xuất Excel thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      message.error('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn nút xuất Excel
  const handleExportClick = () => {
    // Reset form và hiển thị modal
    exportForm.resetFields();
    setSelectedExportYear(null);
    setIsExportModalVisible(true);
  };

  // Hàm xử lý khi xác nhận xuất Excel
  const handleExportConfirm = () => {
    const values = exportForm.getFieldsValue();
    exportToExcel(values.namHoc);
    setIsExportModalVisible(false);
  };

  // Lấy danh sách năm học duy nhất từ danh sách nhóm học phần
  const getUniqueAcademicYears = () => {
    const years = [...new Set(courseGroups
      .filter(group => group.namHoc)
      .map(group => group.namHoc))];
    return years.sort();
  };

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
        // Nhận dạng đúng các trường mã giảng viên có thể có
        const maGiangVien = lecturer.maGiangVien || lecturer.maGv || lecturer.maGV || 
                            lecturer.ma_gv || lecturer.magv || lecturer.magiangvien || '';
        
        return (
          <Tooltip title={`${record.boMon || ''} - ${record.khoa || ''}`}>
            <span>
              {text || `ID: ${record.giangVienId}`}
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
        // Chuẩn hóa giá trị vai trò
        let displayVaiTro = vaiTro;
        if (vaiTro === 'Phụ trách' || vaiTro === 'Giảng viên chính') {
          color = 'green';
          displayVaiTro = 'Phụ trách';
        } else if (vaiTro === 'Trợ giảng') {
          color = 'orange';
        } else if (vaiTro === 'Giảng viên thỉnh giảng') {
          color = 'purple';
        }
        return <Tag color={color}>{displayVaiTro}</Tag>;
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
                
                console.log("Dữ liệu giảng viên chi tiết:", lecturer);
                
                // Nhận dạng đúng các trường mã giảng viên có thể có
                const maGiangVien = lecturer.maGiangVien || lecturer.maGv || lecturer.maGV || 
                                    lecturer.ma_gv || lecturer.magv || lecturer.magiangvien || '';
                
                // Lấy thông tin học phần từ nhóm
                let tenHocPhan = '';
                let maHocPhan = '';
                
                // Kiểm tra cấu trúc dữ liệu và lấy thông tin học phần
                if (courseGroup.hocPhan) {
                  tenHocPhan = courseGroup.hocPhan.tenHp;
                  maHocPhan = courseGroup.hocPhan.maHp;
                } else if (courseGroup.hocPhanId) {
                  const hocPhan = hocPhanList.find(hp => hp.id === courseGroup.hocPhanId);
                  if (hocPhan) {
                    tenHocPhan = hocPhan.tenHp || hocPhan.tenHP || hocPhan.ten_hp;
                    maHocPhan = hocPhan.maHp || hocPhan.maHP || hocPhan.ma_hp;
                  } else {
                    tenHocPhan = `ID: ${courseGroup.hocPhanId}`;
                  }
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
                        <p><strong>Họ tên:</strong> {lecturer.hoTen || lecturer.ho_ten || lecturer.ten || 'N/A'}</p>
                        <p><strong>Mã giảng viên:</strong> {maGiangVien || 'N/A'}</p>
                        <p><strong>Bộ môn:</strong> {lecturer.boMon || lecturer.bo_mon || 'N/A'}</p>
                        <p><strong>Khoa:</strong> {lecturer.khoa || 'N/A'}</p>
                      </div>
                      
                      <Divider />
                      
                      <div style={{ marginBottom: 16 }}>
                        <h3>Thông tin nhóm học phần</h3>
                        <p><strong>Mã nhóm:</strong> {courseGroup.maNhom || courseGroup.ma_nhom || 'N/A'}</p>
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
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportClick}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            loading={loading}
          >
            Xuất Excel
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
            // Khởi tạo danh sách học phần lọc khi mở modal
            updateFilteredHocPhanList(selectedHocKy, selectedNamHoc);
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
                        optionFilterProp="label"
                        value={selectedMonHoc}
                        onChange={handleMonHocChange}
                        filterOption={(input, option) => {
                          // Sử dụng optionFilterProp="label" và kiểm tra xem option có tồn tại không
                          if (!option || !option.label) return false;
                          return option.label.toLowerCase().includes(input.toLowerCase());
                        }}
                        allowClear
                        options={filteredHocPhanList.map(hp => {
                          const maHp = hp.maHp || hp.maHP || hp.ma_hp || '';
                          const tenHp = hp.tenHp || hp.tenHP || hp.ten_hp || '';
                          const label = `${maHp ? `[${maHp}] ` : ''}${tenHp}`;
                          return {
                            value: hp.id,
                            label: label
                          };
                        })}
                      />
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
              filterOption={(input, option) => {
                if (!option || !option.label) return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              disabled={editingId !== null}
              optionLabelProp="label"
              onChange={(value) => {
                const selectedGroup = filteredGroups.find(g => g.id === value);
                if (selectedGroup && selectedGroup.isAssigned) {
                  const assignment = selectedGroup.assignmentInfo;
                  const lecturer = lecturers.find(l => l.id === assignment?.giangVienId);
                  
                  Modal.warning({
                    title: 'Nhóm học phần đã có giảng viên phụ trách',
                    content: (
                      <div>
                        <p>Nhóm học phần này đã được phân công cho giảng viên phụ trách:</p>
                        <p><strong>Giảng viên:</strong> {lecturer?.hoTen || 'Không xác định'}</p>
                        <p><strong>Vai trò:</strong> {assignment?.vaiTro || 'Phụ trách'}</p>
                        <p>Nếu tiếp tục, bạn sẽ thêm một giảng viên khác cho nhóm này.</p>
                      </div>
                    ),
                  });
                }
              }}
              options={filteredGroups.map(group => {
                const isAssigned = group.isAssigned;
                const assignmentInfo = group.assignmentInfo;
                const lecturer = lecturers.find(l => l.id === assignmentInfo?.giangVienId);
                
                // Tìm thông tin học phần
                const hocPhanName = group.hocPhan ? group.hocPhan.tenHp : 'Không xác định';
                
                // Tạo nội dung hiển thị
                const displayText = `${group.maNhom} - ${hocPhanName}`;
                
                // Thêm thông tin giảng viên nếu đã phân công
                const assignedText = isAssigned 
                  ? `[Đã phân công: ${lecturer?.hoTen || 'Không xác định'}]` 
                  : '';
                
                return {
                  value: group.id,
                  label: displayText,
                  disabled: isAssigned && form.getFieldValue('vaiTro') === 'Phụ trách',
                  // Các thông tin bổ sung để hiển thị trong option
                  render: (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{displayText}</span>
                      {isAssigned && (
                        <Tag color="red">{assignedText}</Tag>
                      )}
                    </div>
                  )
                };
              })}
              dropdownRender={menu => {
                return (
                  <div>
                    {menu}
                    {filteredGroups.length === 0 && (
                      <div style={{ padding: '8px', textAlign: 'center' }}>
                        <span>Không tìm thấy nhóm học phần phù hợp</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="giangVienId"
            label="Giảng viên"
            rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                if (!option || !option.label) return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={lecturers.map(lecturer => ({
                value: lecturer.id,
                label: `${lecturer.maGv ? `[${lecturer.maGv}] ` : ''}${lecturer.hoTen || 'Không xác định'}`,
              }))}
              dropdownRender={menu => {
                return (
                  <div>
                    {menu}
                    {lecturers.length === 0 && (
                      <div style={{ padding: '8px', textAlign: 'center' }}>
                        <span>Không tìm thấy giảng viên</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="vaiTro"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
            initialValue="Phụ trách"
          >
            <Select 
              placeholder="Chọn vai trò"
              onChange={(value) => {
                // Kiểm tra khi đổi vai trò
                const nhomId = form.getFieldValue('nhomId');
                if (nhomId) {
                  const selectedGroup = filteredGroups.find(g => g.id === nhomId);
                  if (selectedGroup && selectedGroup.isAssigned && 
                     (value === 'Phụ trách' || value === 'Giảng viên chính')) {
                    // Nếu đã có giảng viên phụ trách và đang chọn vai trò phụ trách
                    const assignment = selectedGroup.assignmentInfo;
                    const lecturer = lecturers.find(l => l.id === assignment?.giangVienId);
                    
                    Modal.warning({
                      title: 'Cảnh báo vai trò trùng lặp',
                      content: (
                        <div>
                          <p>Nhóm học phần này đã được phân công cho giảng viên phụ trách:</p>
                          <p><strong>Giảng viên:</strong> {lecturer?.hoTen || 'Không xác định'}</p>
                          <p>Mỗi nhóm học phần chỉ có thể có một giảng viên với vai trò "Phụ trách".</p>
                          <p>Vui lòng chọn vai trò khác (Trợ giảng, Giảng viên thỉnh giảng) hoặc chọn nhóm học phần khác.</p>
                        </div>
                      )
                    });
                    // Đặt lại giá trị vai trò
                    form.setFieldsValue({ vaiTro: 'Trợ giảng' });
                  }
                }
              }}
            >
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

      {/* Modal xuất Excel */}
      <Modal
        title="Xuất Excel phân công giảng dạy"
        open={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
        destroyOnClose={true}
        width={500}
      >
        <Form 
          form={exportForm} 
          layout="vertical" 
          onFinish={handleExportConfirm}
        >
          <Form.Item
            name="namHoc"
            label="Năm học"
            rules={[{ required: true, message: 'Vui lòng chọn năm học!' }]}
          >
            <Select
              placeholder="Chọn năm học cần xuất dữ liệu"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                if (!option || !option.label) return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              allowClear
              options={getUniqueAcademicYears().map(year => ({
                value: year,
                label: year
              }))}
            />
          </Form.Item>
          
          <div style={{ textAlign: 'right', marginTop: 20 }}>
            <Space>
              <Button onClick={() => setIsExportModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Xác nhận
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageTeachingAssignments;