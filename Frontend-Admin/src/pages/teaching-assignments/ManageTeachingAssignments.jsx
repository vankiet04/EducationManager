import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Badge, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const ManageTeachingAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courseGroups, setCourseGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real application, these would be separate API calls
      const assignmentsResponse = await axios.get('/api/phan-cong');
      const lecturersResponse = await axios.get('/api/giang-vien');
      const courseGroupsResponse = await axios.get('/api/nhom-hoc-phan');
      
      setAssignments(assignmentsResponse.data || mockAssignments);
      setLecturers(lecturersResponse.data || mockLecturers);
      setCourseGroups(courseGroupsResponse.data || mockCourseGroups);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      setAssignments(mockAssignments);
      setLecturers(mockLecturers);
      setCourseGroups(mockCourseGroups);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for testing
  const mockLecturers = [
    { id: 1, maGiangVien: 'GV001', hoTen: 'Trần Thị Phương', boMon: 'Công nghệ phần mềm', khoa: 'Công nghệ thông tin' },
    { id: 2, maGiangVien: 'GV002', hoTen: 'Lê Thanh Hùng', boMon: 'Khoa học máy tính', khoa: 'Công nghệ thông tin' },
    { id: 3, maGiangVien: 'GV003', hoTen: 'Phạm Tuấn Minh', boMon: 'Hệ thống thông tin', khoa: 'Công nghệ thông tin' },
  ];

  const mockCourseGroups = [
    { id: 1, maNhom: 'CS101.1', tenHocPhan: 'Nhập môn lập trình', maHocPhan: 'CS101', hocKy: 'Học kỳ 1 năm 2023-2024', phongHoc: 'B1-201' },
    { id: 2, maNhom: 'CS201.1', tenHocPhan: 'Cấu trúc dữ liệu và giải thuật', maHocPhan: 'CS201', hocKy: 'Học kỳ 1 năm 2023-2024', phongHoc: 'B2-303' },
    { id: 3, maNhom: 'CS301.1', tenHocPhan: 'Cơ sở dữ liệu', maHocPhan: 'CS301', hocKy: 'Học kỳ 2 năm 2023-2024', phongHoc: 'B1-202' },
  ];
  
  const mockAssignments = [
    {
      id: 1,
      nhomId: 1,
      giangVienId: 1,
      vaiTro: 'Giảng viên chính',
      soTiet: 45
    },
    {
      id: 2,
      nhomId: 1,
      giangVienId: 2,
      vaiTro: 'Trợ giảng',
      soTiet: 15
    },
    {
      id: 3,
      nhomId: 2,
      giangVienId: 3,
      vaiTro: 'Giảng viên chính',
      soTiet: 60
    }
  ];

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
        
        return {
          ...assignment,
          tenGiangVien: lecturer.hoTen,
          boMon: lecturer.boMon,
          khoa: lecturer.khoa,
          maNhom: courseGroup.maNhom,
          tenHocPhan: courseGroup.tenHocPhan,
          maHocPhan: courseGroup.maHocPhan,
          hocKy: courseGroup.hocKy,
          phongHoc: courseGroup.phongHoc
        };
      });
    }

    return assignments
      .map(assignment => {
        const lecturer = lecturers.find(lec => lec.id === assignment.giangVienId) || {};
        const courseGroup = courseGroups.find(group => group.id === assignment.nhomId) || {};
        
        return {
          ...assignment,
          tenGiangVien: lecturer.hoTen,
          boMon: lecturer.boMon,
          khoa: lecturer.khoa,
          maNhom: courseGroup.maNhom,
          tenHocPhan: courseGroup.tenHocPhan,
          maHocPhan: courseGroup.maHocPhan,
          hocKy: courseGroup.hocKy,
          phongHoc: courseGroup.phongHoc
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
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phân công giảng dạy này?',
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.delete(`/api/phan-cong/${id}`);
          
          // Update local state
          const updatedAssignments = assignments.filter(assignment => assignment.id !== id);
          setAssignments(updatedAssignments);
          
          Modal.success({
            content: 'Xóa phân công giảng dạy thành công'
          });
        } catch (error) {
          console.error('Error deleting assignment:', error);
          Modal.error({
            content: 'Có lỗi xảy ra khi xóa phân công giảng dạy'
          });
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
      const assignmentData = {
        nhomId: values.nhomId,
        giangVienId: values.giangVienId,
        vaiTro: values.vaiTro,
        soTiet: values.soTiet
      };

      if (editingId) {
        // Update existing assignment
        // In a real application, this would be an API call
        // await axios.put(`/api/phan-cong/${editingId}`, assignmentData);
        
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
      } else {
        // Create new assignment
        // In a real application, this would be an API call
        // const response = await axios.post('/api/phan-cong', assignmentData);
        // const newAssignment = response.data;
        
        const newAssignment = {
          id: Math.max(...assignments.map(a => a.id), 0) + 1,
          ...assignmentData
        };
        
        setAssignments([...assignments, newAssignment]);
        Modal.success({
          content: 'Thêm phân công giảng dạy mới thành công'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        content: 'Có lỗi xảy ra khi lưu phân công giảng dạy'
      });
    } finally {
      setLoading(false);
    }
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
      render: (text, record) => (
        <Tooltip title={`${record.boMon || ''} - ${record.khoa || ''}`}>
          <span>{text || `ID: ${record.giangVienId}`}</span>
        </Tooltip>
      ),
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
        if (vaiTro === 'Giảng viên chính') {
          color = 'green';
        } else if (vaiTro === 'Trợ giảng') {
          color = 'orange';
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
      dataIndex: 'tenHocPhan',
      key: 'tenHocPhan',
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Tooltip placement="topLeft" title={text}>
          {text || ''}
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
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          {text || ''}
        </Tooltip>
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
                
                Modal.info({
                  title: 'Chi tiết phân công giảng dạy',
                  width: 600,
                  content: (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ marginBottom: 16 }}>
                        <h3>Thông tin giảng viên</h3>
                        <p><strong>Họ tên:</strong> {lecturer.hoTen || 'N/A'}</p>
                        <p><strong>Mã giảng viên:</strong> {lecturer.maGiangVien || 'N/A'}</p>
                        <p><strong>Bộ môn:</strong> {lecturer.boMon || 'N/A'}</p>
                        <p><strong>Khoa:</strong> {lecturer.khoa || 'N/A'}</p>
                      </div>
                      
                      <Divider />
                      
                      <div style={{ marginBottom: 16 }}>
                        <h3>Thông tin nhóm học phần</h3>
                        <p><strong>Mã nhóm:</strong> {courseGroup.maNhom || 'N/A'}</p>
                        <p><strong>Tên học phần:</strong> {courseGroup.tenHocPhan || 'N/A'}</p>
                        <p><strong>Mã học phần:</strong> {courseGroup.maHocPhan || 'N/A'}</p>
                        <p><strong>Học kỳ:</strong> {courseGroup.hocKy || 'N/A'}</p>
                        <p><strong>Phòng học:</strong> {courseGroup.phongHoc || 'N/A'}</p>
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
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
              setEditingId(null);
              form.resetFields();
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
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="giangVienId"
            label="Giảng viên"
            rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              optionFilterProp="children"
            >
              {lecturers.map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {lecturer.hoTen} ({lecturer.maGiangVien})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nhomId"
            label="Nhóm học phần"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm học phần!' }]}
          >
            <Select
              placeholder="Chọn nhóm học phần"
              showSearch
              optionFilterProp="children"
            >
              {courseGroups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.maNhom} - {group.tenHocPhan}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vaiTro"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Giảng viên chính">Giảng viên chính</Option>
              <Option value="Trợ giảng">Trợ giảng</Option>
              <Option value="Giảng viên thỉnh giảng">Giảng viên thỉnh giảng</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="soTiet"
            label="Số tiết"
            rules={[{ required: true, message: 'Vui lòng nhập số tiết!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số tiết giảng dạy" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}
              >
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