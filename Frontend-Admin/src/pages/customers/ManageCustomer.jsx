// ManageCustomer.jsx - Trang quản lý người dùng
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tag, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  LockOutlined, UnlockOutlined, ReloadOutlined, EyeOutlined, EllipsisOutlined, FilterOutlined, InfoCircleOutlined, 
  TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const ManageCustomer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [detailUser, setDetailUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch user data from backend API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/user');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải danh sách người dùng'
      });
      setLoading(false);
    }
  };

  // Handle viewing a user
  const handleViewDetail = (record) => {
    setDetailUser(record);
    setIsDetailModalVisible(true);
  };

  // Handle editing a user
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      username: record.username,
      hoTen: record.hoTen,
      email: record.email,
      soDienThoai: record.soDienThoai,
      namSinh: record.namSinh,
      trangThai: record.trangThai,
      roles: record.roles?.map(role => role.name)
    });
    setIsModalVisible(true);
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      onOk: async () => {
        try {
          setLoading(true);
          // In a real application, you'd call an API to delete the user
          // await axios.delete(`http://localhost:8080/api/user/${userId}`);
          fetchUsers(); // Refresh the user list
        } catch (error) {
          console.error('Error deleting user:', error);
          Modal.error({
            content: 'Không thể xóa người dùng'
          });
          setLoading(false);
        }
      }
    });
  };

  // Handle toggling user status
  const handleToggleStatus = async (record) => {
    try {
      setLoading(true);
      const newStatus = !record.trangThai;
      
      // In a real application, you'd call an API to update the status
      // await axios.patch(`http://localhost:8080/api/user/${record.id}`, { trangThai: newStatus });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating user status:', error);
      Modal.error({
        content: 'Không thể cập nhật trạng thái người dùng'
      });
      setLoading(false);
    }
  };

  // Handle form submit (add/edit user)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (editingId) {
        // In a real application, you'd call an API to update the user
        // await axios.put(`http://localhost:8080/api/user/${editingId}`, values);
      } else {
        // In a real application, you'd call an API to add a new user
        // await axios.post('http://localhost:8080/api/user', values);
      }
      
      setIsModalVisible(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        content: 'Không thể lưu thông tin người dùng'
      });
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = searchText
    ? users.filter(user => 
        (user.username && user.username.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.hoTen && user.hoTen.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.soDienThoai && user.soDienThoai.toLowerCase().includes(searchText.toLowerCase()))
      )
    : users;

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: true,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      sorter: true,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 200,
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      sorter: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 150,
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      width: 150,
      render: (roles) => (
        <span>
          {roles && roles.map(role => (
            <Tag color="blue" key={role.id}>
              {role.name.replace('ROLE_', '')}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: 'Năm sinh',
      dataIndex: 'namSinh',
      key: 'namSinh',
      width: 120,
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (trangThai) => (
        <Tag color={trangThai ? 'green' : 'red'}>
          {trangThai ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 280,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
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
          <Button
            type={record.trangThai ? 'default' : 'primary'}
            onClick={() => handleToggleStatus(record)}
          >
            {record.trangThai ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetail(record)}
          />
        </Space>
      ),
    },
  ];

  // Main component render
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ color: '#1890ff' }}>
          QUẢN LÝ NGƯỜI DÙNG
          <TeamOutlined style={{ marginLeft: '10px' }} />
        </Title>
        <Space wrap>
              <Input
            placeholder="Tìm kiếm theo tên, email..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={handleSearch}
            allowClear
          />
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trangThai: true
              });
              setIsModalVisible(true);
            }}
          >
            Thêm người dùng
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchUsers}
          >
            Làm mới
          </Button>
        </Space>
            </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={loading}
          scroll={{ x: 'max-content' }}
              />
            </div>

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEdit(detailUser);
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
        width={600}
      >
        {detailUser && (
          <div style={{ padding: '16px' }}>
            <p><strong>ID:</strong> {detailUser.id}</p>
            <p><strong>Tên đăng nhập:</strong> {detailUser.username}</p>
            <p><strong>Họ và tên:</strong> {detailUser.hoTen}</p>
            <p><strong>Email:</strong> {detailUser.email}</p>
            <p><strong>Số điện thoại:</strong> {detailUser.soDienThoai}</p>
            <p><strong>Năm sinh:</strong> {detailUser.namSinh}</p>
            <p>
              <strong>Vai trò:</strong>{' '}
              {detailUser.roles && detailUser.roles.map(role => (
                <Tag color="blue" key={role.id}>
                  {role.name.replace('ROLE_', '')}
                </Tag>
              ))}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <Tag color={detailUser.trangThai ? 'green' : 'red'}>
                {detailUser.trangThai ? 'Hoạt động' : 'Vô hiệu hóa'}
              </Tag>
            </p>
          </div>
        )}
      </Modal>

      {/* Modal thêm/sửa */}
      <Modal
        title={editingId ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        maskClosable={false}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input disabled={!!editingId} />
          </Form.Item>
          
          {!editingId && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: !editingId, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          
          <Form.Item
            name="hoTen"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="namSinh"
            label="Năm sinh"
          >
            <Input type="number" />
          </Form.Item>
          
          <Form.Item
            name="roles"
            label="Vai trò"
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              <Option value="ROLE_ADMIN">Admin</Option>
              <Option value="ROLE_USER">User</Option>
              <Option value="ROLE_MANAGER">Manager</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value={true}>Hoạt động</Option>
              <Option value={false}>Vô hiệu hóa</Option>
            </Select>
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
      
      <style jsx global>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .action-column {
          background: white;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.03);
        }
        .action-buttons {
          white-space: nowrap;
        }
      `}</style>
    </Card>
  );
};

export default ManageCustomer;