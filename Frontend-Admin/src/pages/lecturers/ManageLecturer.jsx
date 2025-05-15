// ManageLecturer.jsx - Trang quản lý giảng viên
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

// API base URL
const API_URL = 'http://localhost:8080/api';

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
      // Show error message to user
      message.error(error.response.data.message || 'Có lỗi xảy ra');
    }
    return Promise.reject(error);
  }
);

const ManageLecturer = () => {
  const [lecturers, setLecturers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch data on component mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Fetch lecturer data and combine with user data
  const fetchLecturers = async () => {
    setLoading(true);
    try {
      // Fetch lecturers from API
      const lecturersResponse = await axios.get('/giangvien');
      const lecturersData = lecturersResponse.data.filter(lecturer => lecturer.trangThai === 1); // Only get active lecturers
      
      // Fetch users from API
      const usersResponse = await axios.get('/user');
      const usersData = usersResponse.data;
      
      // Combine lecturer data with user data
      const lecturersWithUserInfo = lecturersData.map(lecturer => {
        const user = usersData.find(user => user.id === lecturer.userId);
        return {
          ...lecturer,
          user_email: user ? user.email : 'N/A',
          user_username: user ? user.username : 'N/A',
          user_hoTen: user ? user.hoTen : 'N/A'
        };
      });
      
      setLecturers(lecturersWithUserInfo);
      
      // Find users that don't have a lecturer account yet
      const usedUserIds = lecturersData.map(lecturer => lecturer.userId);
      const availableUsersList = usersData.filter(user => 
        !usedUserIds.includes(user.id) && user.vaiTro === 'GIANG_VIEN'
      );
      
      setAvailableUsers(availableUsersList);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      message.error('Không thể tải danh sách giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a lecturer
  const handleEdit = async (record) => {
    try {
      setLoading(true);
      const response = await axios.get(`/giangvien/${record.id}`);
      const lecturerData = response.data;
      
      setEditingId(record.id);
      form.setFieldsValue({
        maGiangVien: lecturerData.maGiangVien,
        hoTen: lecturerData.hoTen,
        boMon: lecturerData.boMon,
        khoa: lecturerData.khoa,
        trinhDo: lecturerData.trinhDo,
        chuyenMon: lecturerData.chuyenMon,
        userId: lecturerData.userId,
        trangThai: lecturerData.trangThai
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching lecturer details:', error);
      message.error('Không thể tải thông tin giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a lecturer
  const handleDelete = async (lecturerId) => {
    Modal.confirm({
      title: 'Xác nhận xoá giảng viên',
      content: 'Bạn có chắc chắn muốn xoá hóa giảng viên này? Giảng viên sẽ không còn hiển thị trong danh sách.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          const lecturer = lecturers.find(l => l.id === lecturerId);
          const updatedLecturer = { ...lecturer, trangThai: 0 };
          await axios.put(`/giangvien/${lecturerId}`, updatedLecturer);
          message.success('Xoá hóa giảng viên thành công');
          fetchLecturers();
        } catch (error) {
          console.error('Error deactivating lecturer:', error);
          message.error('Không thể xoá hóa giảng viên');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle assigning user to lecturer
  const handleAssignUser = async (lecturerId, userId) => {
    try {
      setLoading(true);
      await axios.post(`/giangvien/${lecturerId}/assign-user/${userId}`);
      message.success('Gán tài khoản cho giảng viên thành công');
      fetchLecturers(); // Refresh the list
    } catch (error) {
      console.error('Error assigning user:', error);
      message.error('Không thể gán tài khoản cho giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit (add/edit lecturer)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const lecturerData = {
        id: editingId || null,
        maGiangVien: values.maGiangVien,
        hoTen: values.hoTen,
        boMon: values.boMon,
        khoa: values.khoa,
        trinhDo: values.trinhDo,
        chuyenMon: values.chuyenMon,
        userId: values.userId,
        trangThai: 1 // Always set to active
      };
      
      if (editingId) {
        // Update existing lecturer
        await axios.put(`/giangvien/${editingId}`, lecturerData);
        message.success('Cập nhật giảng viên thành công');
      } else {
        // Create new lecturer
        await axios.post('/giangvien', lecturerData);
        message.success('Thêm giảng viên mới thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchLecturers(); // Refresh the list
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Không thể lưu thông tin giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique lecturer code
  const generateLecturerCode = () => {
    const prefix = "GV";
    const existingCodes = lecturers.map(l => l.maGiangVien);
    let newCode;
    let counter = lecturers.length + 1;
    
    do {
      newCode = `${prefix}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingCodes.includes(newCode));
    
    form.setFieldsValue({
      maGiangVien: newCode
    });
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = searchText
    ? lecturers.filter(lecturer => 
        lecturer.maGiangVien?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.boMon?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.khoa?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.user_username?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.user_email?.toLowerCase().includes(searchText.toLowerCase())
      )
    : lecturers;

  // Define table columns
  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'maGiangVien',
      key: 'maGiangVien',
      width: 120,
      sorter: (a, b) => a.maGiangVien?.localeCompare(b.maGiangVien),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.hoTen?.localeCompare(b.hoTen),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Bộ môn',
      dataIndex: 'boMon',
      key: 'boMon',
      width: 150,
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
      title: 'Khoa',
      dataIndex: 'khoa',
      key: 'khoa',
      width: 150,
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
      title: 'Trình độ',
      dataIndex: 'trinhDo',
      key: 'trinhDo',
      width: 120,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'user_username',
      key: 'user_username',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.user_username?.localeCompare(b.user_username),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text || 'Chưa gán'}
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.user_email?.localeCompare(b.user_email),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'chuyenMon',
      key: 'chuyenMon',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.chuyenMon?.localeCompare(b.chuyenMon),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
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
            Xoá
          </Button>
          {!record.userId && (
            <Select
              style={{ width: 120 }}
              placeholder="Gán tài khoản"
              onChange={(userId) => handleAssignUser(record.id, userId)}
            >
              {availableUsers.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          )}
        </Space>
      ),
    },
  ];

  // Update form to remove trangThai field
  const renderForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="maGiangVien"
        label="Mã giảng viên"
        rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
      >
        <Input 
          disabled={!!editingId}
          addonAfter={
            !editingId && 
            <Button 
              type="link" 
              size="small" 
              onClick={generateLecturerCode}
              style={{ margin: -7 }}
            >
              Tạo mã
            </Button>
          }
        />
      </Form.Item>
      
      <Form.Item
        name="hoTen"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="boMon"
        label="Bộ môn"
        rules={[{ required: true, message: 'Vui lòng nhập bộ môn!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="khoa"
        label="Khoa"
        rules={[{ required: true, message: 'Vui lòng nhập khoa!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="trinhDo"
        label="Trình độ"
        rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
      >
        <Select>
          <Option value="">-- Chọn trình độ --</Option>
          <Option value="Thạc sĩ">Thạc sĩ</Option>
          <Option value="Tiến sĩ">Tiến sĩ</Option>
          <Option value="Phó Giáo sư">Phó Giáo sư</Option>
          <Option value="Giáo sư">Giáo sư</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="chuyenMon"
        label="Chuyên môn"
        rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
      >
        <Input.TextArea placeholder="Các lĩnh vực chuyên môn, ngăn cách bằng dấu phẩy" />
      </Form.Item>
      
      <Form.Item
        name="userId"
        label="Tài khoản người dùng"
        rules={[{ required: true, message: 'Vui lòng chọn tài khoản!' }]}
      >
        <Select disabled={!!editingId}>
          <Option value="">-- Chọn tài khoản --</Option>
          {/* Show the currently assigned user when editing */}
          {editingId && (
            <Option value={form.getFieldValue('userId')}>
              {availableUsers.find(u => u.id === form.getFieldValue('userId'))?.username || 'Unknown'}
            </Option>
          )}
          {/* Show available users when adding new */}
          {!editingId && availableUsers.map(user => (
            <Option key={user.id} value={user.id}>
              {user.username} - {user.hoTen} ({user.email})
            </Option>
          ))}
        </Select>
        {editingId && (
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            Không thể thay đổi tài khoản đã liên kết với giảng viên
          </div>
        )}
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
  );

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý giảng viên</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên, bộ môn, khoa..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={handleSearch}
            allowClear
          />
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (availableUsers.length === 0) {
                Modal.warning({
                  title: 'Thông báo',
                  content: 'Không còn tài khoản giảng viên nào chưa được gán. Vui lòng tạo tài khoản mới trước.'
                });
                return;
              }
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trangThai: 1
              });
              setIsModalVisible(true);
            }}
          >
            Thêm giảng viên
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giảng viên`,
            showSizeChanger: true,
            showQuickJumper: true
          }}
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
        }
      `}</style>

      <Modal
        title={editingId ? "Sửa thông tin giảng viên" : "Thêm giảng viên mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        maskClosable={false}
        width={600}
      >
        {renderForm()}
      </Modal>
    </Card>
  );
};

export default ManageLecturer; 