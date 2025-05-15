// ManageLecturer.jsx - Trang quản lý giảng viên
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tag, Dropdown, Menu, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  LockOutlined, UnlockOutlined, ReloadOutlined, EyeOutlined, EllipsisOutlined } from '@ant-design/icons';
import GiangVienData from '../../api/GiangVien.json';
import UsersData from '../../api/Users.json';

const { Title } = Typography;
const { Option } = Select;

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
      // In a real application, you'd fetch this data from an API
      setTimeout(() => {
        // Combine lecturer data with user data
        const lecturersWithUserInfo = GiangVienData.map(lecturer => {
          const user = UsersData.find(user => user.id === lecturer.user_id);
          return {
            ...lecturer,
            user_email: user ? user.email : 'N/A',
            user_username: user ? user.username : 'N/A'
          };
        });
        
        setLecturers(lecturersWithUserInfo);
        
        // Find users that don't have a lecturer account yet
        const usedUserIds = GiangVienData.map(lecturer => lecturer.user_id);
        const availableUsersList = UsersData.filter(user => 
          !usedUserIds.includes(user.id) && user.vai_tro === 'giangvien'
        );
        
        setAvailableUsers(availableUsersList);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải danh sách giảng viên'
      });
      setLoading(false);
    }
  };

  // Handle editing a lecturer
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ma_gv: record.ma_gv,
      ho_ten: record.ho_ten,
      bo_mon: record.bo_mon,
      khoa: record.khoa,
      trinh_do: record.trinh_do,
      chuyen_mon: record.chuyen_mon,
      user_id: record.user_id,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Handle deleting a lecturer
  const handleDelete = async (lecturerId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa giảng viên này?',
      onOk: async () => {
        try {
          setLoading(true);
          // In a real application, you'd call an API to delete the lecturer
          setTimeout(() => {
            const updatedLecturers = lecturers.filter(lecturer => lecturer.id !== lecturerId);
            setLecturers(updatedLecturers);
            Modal.success({
              content: 'Xóa giảng viên thành công'
            });
            setLoading(false);
          }, 500);
        } catch (error) {
          console.error('Error deleting lecturer:', error);
          Modal.error({
            content: 'Không thể xóa giảng viên'
          });
          setLoading(false);
        }
      }
    });
  };

  // Handle toggling lecturer status
  const handleToggleStatus = async (record) => {
    try {
      setLoading(true);
      const newStatus = record.trang_thai === 1 ? 0 : 1;
      
      // In a real application, you'd call an API to update the status
      setTimeout(() => {
        const updatedLecturers = lecturers.map(lecturer => {
          if (lecturer.id === record.id) {
            return { ...lecturer, trang_thai: newStatus };
          }
          return lecturer;
        });
        setLecturers(updatedLecturers);
        Modal.success({
          content: `Giảng viên đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating lecturer status:', error);
      Modal.error({
        content: 'Không thể cập nhật trạng thái giảng viên'
      });
      setLoading(false);
    }
  };

  // Handle form submit (add/edit lecturer)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      if (editingId) {
        // In a real application, you'd call an API to update the lecturer
        setTimeout(() => {
          const updatedLecturers = lecturers.map(lecturer => {
            if (lecturer.id === editingId) {
              // Find the user associated with this lecturer
              const user = UsersData.find(u => u.id === parseInt(values.user_id));
              return { 
                ...lecturer, 
                ...values,
                user_id: parseInt(values.user_id),
                user_email: user ? user.email : 'N/A',
                user_username: user ? user.username : 'N/A'
              };
            }
            return lecturer;
          });
          setLecturers(updatedLecturers);
          setIsModalVisible(false);
          Modal.success({
            content: 'Cập nhật giảng viên thành công'
          });
          setLoading(false);
        }, 500);
      } else {
        // In a real application, you'd call an API to add a new lecturer
        setTimeout(() => {
          // Find the user associated with this lecturer
          const user = UsersData.find(u => u.id === parseInt(values.user_id));
          const newLecturer = {
            id: Math.max(...lecturers.map(l => l.id), 0) + 1,
            ...values,
            user_id: parseInt(values.user_id),
            user_email: user ? user.email : 'N/A',
            user_username: user ? user.username : 'N/A'
          };
          const updatedLecturers = [...lecturers, newLecturer];
          setLecturers(updatedLecturers);
          
          // Update the list of available users
          const newUsedUserIds = [...lecturers.map(l => l.user_id), parseInt(values.user_id)];
          const newAvailableUsers = UsersData.filter(user => 
            !newUsedUserIds.includes(user.id) && user.vai_tro === 'giangvien'
          );
          setAvailableUsers(newAvailableUsers);
          
          setIsModalVisible(false);
          Modal.success({
            content: 'Thêm giảng viên mới thành công'
          });
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        content: 'Không thể lưu thông tin giảng viên'
      });
      setLoading(false);
    }
  };

  // Generate a unique lecturer code
  const generateLecturerCode = () => {
    const prefix = "GV";
    const existingCodes = lecturers.map(l => l.ma_gv);
    let newCode;
    let counter = lecturers.length + 1;
    
    do {
      newCode = `${prefix}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingCodes.includes(newCode));
    
    form.setFieldsValue({
      ma_gv: newCode
    });
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Tạo danh sách bộ môn, khoa và trình độ cho bộ lọc
  const getUniqueValues = (data, field) => {
    const values = [...new Set(data.map(item => item[field]))];
    return values.map(value => ({ text: value, value }));
  };

  const boMonFilters = lecturers.length > 0 ? getUniqueValues(lecturers, 'bo_mon') : [];
  const khoaFilters = lecturers.length > 0 ? getUniqueValues(lecturers, 'khoa') : [];
  const trinhDoFilters = lecturers.length > 0 ? getUniqueValues(lecturers, 'trinh_do') : [];

  // Define table columns
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
      title: 'Mã GV',
      dataIndex: 'ma_gv',
      key: 'ma_gv',
      width: 120,
      sorter: (a, b) => a.ma_gv.localeCompare(b.ma_gv),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'ho_ten',
      key: 'ho_ten',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.ho_ten.localeCompare(b.ho_ten),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Bộ môn',
      dataIndex: 'bo_mon',
      key: 'bo_mon',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      filters: boMonFilters,
      onFilter: (value, record) => record.bo_mon === value,
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
      filters: khoaFilters,
      onFilter: (value, record) => record.khoa === value,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Trình độ',
      dataIndex: 'trinh_do',
      key: 'trinh_do',
      width: 120,
      filters: trinhDoFilters,
      onFilter: (value, record) => record.trinh_do === value,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'user_username',
      key: 'user_username',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.user_username.localeCompare(b.user_username),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
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
      sorter: (a, b) => a.user_email.localeCompare(b.user_email),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'chuyen_mon',
      key: 'chuyen_mon',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.chuyen_mon.localeCompare(b.chuyen_mon),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 120,
      filters: [
        { text: 'Hoạt động', value: 1 },
        { text: 'Vô hiệu hóa', value: 0 },
      ],
      onFilter: (value, record) => record.trang_thai === value,
      render: (trangThai) => (
        <Tag color={trangThai === 1 ? 'green' : 'red'}>
          {trangThai === 1 ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
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
          <Button
            type={record.trang_thai === 1 ? 'default' : 'primary'}
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.trang_thai === 1 ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  // Filter data based on search text
  const filteredData = searchText
    ? lecturers.filter(lecturer => 
        lecturer.ma_gv.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.ho_ten.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.bo_mon.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.khoa.toLowerCase().includes(searchText.toLowerCase())
      )
    : lecturers;

  // Main component render
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
                trang_thai: 1
              });
              setIsModalVisible(true);
            }}
          >
            Thêm giảng viên
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchLecturers}
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
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10 }}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="ma_gv"
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
            name="ho_ten"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="bo_mon"
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
            name="trinh_do"
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
            name="chuyen_mon"
            label="Chuyên môn"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
          >
            <Input.TextArea placeholder="Các lĩnh vực chuyên môn, ngăn cách bằng dấu phẩy" />
          </Form.Item>
          
          <Form.Item
            name="user_id"
            label="Tài khoản người dùng"
            rules={[{ required: true, message: 'Vui lòng chọn tài khoản!' }]}
          >
            <Select disabled={!!editingId}>
              <Option value="">-- Chọn tài khoản --</Option>
              {/* Show the currently assigned user when editing */}
              {editingId && (
                <Option value={form.getFieldValue('user_id')}>
                  {UsersData.find(u => u.id === form.getFieldValue('user_id'))?.username || 'Unknown'}
                </Option>
              )}
              {/* Show available users when adding new */}
              {!editingId && availableUsers.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.username} - {user.ho_ten} ({user.email})
                </Option>
              ))}
            </Select>
            {editingId && (
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                Không thể thay đổi tài khoản đã liên kết với giảng viên
              </div>
            )}
          </Form.Item>
          
          <Form.Item
            name="trang_thai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Vô hiệu hóa</Option>
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
    </Card>
  );
};

export default ManageLecturer; 