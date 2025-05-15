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
      vaiTro: record.vaiTro
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
          await axios.delete(`http://localhost:8080/api/user/${userId}`);
          
          Modal.success({
            title: 'Thành công',
            content: 'Xóa người dùng thành công!'
          });
          
          fetchUsers(); // Refresh the user list
          setLoading(false);
        } catch (error) {
          console.error('Error deleting user:', error);
          Modal.error({
            title: 'Lỗi',
            content: `Không thể xóa người dùng: ${error.response?.data?.message || error.message}`
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
      // If the user is active, set status to false (0)
      // If already inactive, set status to true (1)
      const newStatus = record.trangThai ? false : true;
      
      // Create a UserDto with only the status field
      const statusUpdate = {
        trangThai: newStatus
      };
      
      await axios.put(`http://localhost:8080/api/user/${record.id}`, statusUpdate);
      
      Modal.success({
        title: 'Thành công',
        content: `Người dùng đã được ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công!`
      });
      
      fetchUsers(); // Refresh the user list
      setLoading(false);
    } catch (error) {
      console.error('Error updating user status:', error);
      Modal.error({
        title: 'Lỗi',
        content: `Không thể cập nhật trạng thái người dùng: ${error.response?.data?.message || error.message}`
      });
      setLoading(false);
    }
  };

  // Handle form submit (add/edit user)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Create a proper UserDto object
      const userData = {
        username: values.username,
        password: values.password,
        hoTen: values.hoTen,
        email: values.email,
        soDienThoai: values.soDienThoai,
        namSinh: values.namSinh ? parseInt(values.namSinh) : null,
        trangThai: values.trangThai,
        vaiTro: values.vaiTro
      };
      
      console.log('Sending user data:', userData);
      
      if (editingId) {
        // Update existing user
        await axios.put(`http://localhost:8080/api/user/${editingId}`, userData);
        
        Modal.success({
          title: 'Thành công',
          content: 'Cập nhật người dùng thành công!'
        });
      } else {
        // Add new user - using the /register endpoint for better validation
        const response = await axios.post('http://localhost:8080/api/user/register', userData);
        
        Modal.success({
          title: 'Thành công',
          content: 'Thêm người dùng mới thành công!'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(); // Refresh the user list
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show detailed error message
      Modal.error({
        title: 'Lỗi',
        content: `Không thể lưu thông tin người dùng: ${error.response?.data?.message || error.message}`
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
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      width: 150,
      render: (vaiTro) => (
        <span>
          <Tag color="blue">
            {vaiTro}
          </Tag>
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
              <Tag color="blue">
                {detailUser.vaiTro}
              </Tag>
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
            name="vaiTro"
            label="Vai trò"
            initialValue="NGUOI_DUNG"
          >
            <Select placeholder="Chọn vai trò">
              <Option value="ADMIN">Admin</Option>
              <Option value="NGUOI_DUNG">Người dùng</Option>
              <Option value="GIANG_VIEN">Giảng viên</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            initialValue={true}
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