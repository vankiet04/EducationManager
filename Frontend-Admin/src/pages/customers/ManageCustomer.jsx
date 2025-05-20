// ManageCustomer.jsx - Trang quản lý người dùng
import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tag } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined, 
  InfoCircleOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const ManageCustomer = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
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
    fetchRoles();
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

  // Fetch roles data from backend API
  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải danh sách vai trò'
      });
    }
  };

  // Handle viewing a user
  const handleViewDetail = (record) => {
    // Fetch user roles if available
    fetchUserRoles(record.id).then(() => {
      setDetailUser(record);
      setIsDetailModalVisible(true);
    });
  };

  // Fetch user roles
  const fetchUserRoles = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/${userId}/roles`);
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = { 
          ...updatedUsers[userIndex], 
          userRoles: response.data 
        };
        setUsers(updatedUsers);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  // Handle editing a user
  const handleEdit = async (record) => {
    setEditingId(record.id);
    
    // Fetch user roles if not already loaded
    let userRoles = record.userRoles;
    if (!userRoles) {
      userRoles = await fetchUserRoles(record.id);
    }
    
    // Determine the role ID to use
    let roleId = null;
    
    // First check if user has roles from the userRoles collection
    if (userRoles && userRoles.length > 0) {
      roleId = userRoles[0].id; // Use the first role ID
    } 
    // Otherwise try to get role from vai_tro field
    else if (record.vai_tro) {
      const parsedRoleId = parseInt(record.vai_tro, 10);
      if (!isNaN(parsedRoleId)) {
        roleId = parsedRoleId;
      }
    }
    
    form.setFieldsValue({
      username: record.username,
      hoTen: record.hoTen,
      email: record.email,
      soDienThoai: record.soDienThoai,
      namSinh: record.namSinh,
      trangThai: record.trangThai,
      roleIds: roleId // Set a single role ID, not an array
    });
    
    setIsModalVisible(true);
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa',
      content: 'Bạn có chắc chắn muốn vô hiệu hóa người dùng này?',
      onOk: async () => {
        try {
          setLoading(true);
          await axios.delete(`http://localhost:8080/api/user/${userId}`);
          
          Modal.success({
            title: 'Thành công',
            content: 'Vô hiệu hóa người dùng thành công!'
          });
          
          fetchUsers(); // Refresh the user list
          setLoading(false);
        } catch (error) {
          console.error('Error deactivating user:', error);
          Modal.error({
            title: 'Lỗi',
            content: `Không thể vô hiệu hóa người dùng: ${error.response?.data?.message || error.message}`
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
      
      // Ensure roleIds is a single value (not an array)
      const roleId = Array.isArray(values.roleIds) 
        ? values.roleIds[0] 
        : values.roleIds;
      
      // Create a proper UserDto object
      const userData = {
        username: values.username,
        password: values.password,
        hoTen: values.hoTen,
        email: values.email,
        soDienThoai: values.soDienThoai,
        namSinh: values.namSinh ? parseInt(values.namSinh) : null,
        trangThai: values.trangThai,
        roleIds: [roleId], // Send as array for the API
        vai_tro: roleId // Send as a number, not string
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
        await axios.post('http://localhost:8080/api/user/register', userData);
        
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
      dataIndex: 'vai_tro',
      key: 'vai_tro',
      width: 150,
      render: (vai_tro, record) => {
        // If userRoles has been loaded, use it
        if (record.userRoles && record.userRoles.length > 0) {
          return (
            <span>
              {record.userRoles.map(role => (
                <Tag color="green" key={role.id}>
                  {role.name}
                </Tag>
              ))}
            </span>
          );
        }
        
        // If vai_tro is a number (role ID), find the corresponding role name
        if (typeof vai_tro === 'number' || (typeof vai_tro === 'string' && !isNaN(parseInt(vai_tro, 10)))) {
          const roleId = typeof vai_tro === 'string' ? parseInt(vai_tro, 10) : vai_tro;
          const role = roles.find(r => r.id === roleId);
          if (role) {
            return (
              <Tag color="green">
                {role.name}
              </Tag>
            );
          }
        }
        
        // Fetch user roles if not yet loaded
        if (!record.userRoles) {
          fetchUserRoles(record.id);
        }
        
        return (
          <Tag color="default">Đang tải vai trò...</Tag>
        );
      },
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
            Vô hiệu hóa
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
              {detailUser.userRoles && detailUser.userRoles.length > 0 ? 
                detailUser.userRoles.map(role => (
                  <Tag color="green" key={role.id}>
                    {role.name}
                  </Tag>
                )) : 
                (() => {
                  console.log("Detail user vai_tro:", detailUser.vai_tro, "type:", typeof detailUser.vai_tro);
                  
                  const vaiTro = detailUser.vai_tro;
                  // Convert to number if it's a string
                  const roleId = typeof vaiTro === 'string' ? parseInt(vaiTro, 10) : vaiTro;
                  
                  // Simple direct match with role ID
                  if (roleId !== null && roleId !== undefined && !isNaN(roleId)) {
                    const role = roles.find(r => r.id === roleId);
                    if (role) {
                      return (
                        <Tag color="green">
                          {role.name}
                        </Tag>
                      );
                    }
                  }
                  
                  // Fallback - display vai_tro as-is if it has a value
                  if (vaiTro) {
                    return <Tag color="blue">{vaiTro}</Tag>;
                  }
                  
                  return <span>Chưa có vai trò</span>;
                })()
              }
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
            name="roleIds"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select 
              placeholder="Chọn vai trò"
              optionFilterProp="children"
            >
              {roles.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
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
        }
        .action-column {
          text-align: center;
        }
        .action-buttons {
          display: flex;
          justify-content: space-around;
        }
        .ant-btn {
          text-transform: capitalize;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ant-select-selector, .ant-input {
          border-radius: 4px !important;
        }
      `}</style>
    </Card>
  );
};

export default ManageCustomer;