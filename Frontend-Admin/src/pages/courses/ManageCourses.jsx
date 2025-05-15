import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, Tag, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

// API base URL
const API_URL = 'http://localhost:8080/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [knowledgeGroups, setKnowledgeGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchKnowledgeGroups();
    fetchCourses();
  }, []);

  // Fetch knowledge groups from API
  const fetchKnowledgeGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/nhomkienthuc`);
      setKnowledgeGroups(response.data);
    } catch (error) {
      console.error('Error fetching knowledge groups:', error);
      message.error('Không thể tải dữ liệu nhóm kiến thức');
    }
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/hocphan`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Không thể tải dữ liệu học phần');
    } finally {
      setLoading(false);
    }
  };

  // Get knowledge group name by ID
  const getKnowledgeGroupName = (nhomKienThucId) => {
    const group = knowledgeGroups.find(group => group.id === nhomKienThucId);
    return group ? group.tenNhom : 'Không xác định';
  };

  // Handle editing a course
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      maHp: record.maHp,
      tenHp: record.tenHp,
      soTinChi: record.soTinChi,
      soTietLyThuyet: record.soTietLyThuyet,
      soTietThucHanh: record.soTietThucHanh,
      nhomKienThucID: record.nhomKienThucID,
      loaiHp: record.loaiHp,
      hocPhanTienQuyet: record.hocPhanTienQuyet || ''
    });
    setIsModalVisible(true);
  };

  // Handle deleting a course
  const handleDelete = (courseId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa học phần này? Học phần sẽ bị ẩn khỏi hệ thống nhưng không bị xóa hoàn toàn.',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${API_URL}/hocphan/${courseId}`);
          message.success('Xóa học phần thành công');
          fetchCourses(); // Refresh the list
        } catch (error) {
          console.error('Error deleting course:', error);
          message.error('Xóa học phần thất bại');
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
      const courseData = {
        maHp: values.maHp,
        tenHp: values.tenHp,
        soTinChi: values.soTinChi,
        soTietLyThuyet: values.soTietLyThuyet,
        soTietThucHanh: values.soTietThucHanh,
        nhomKienThucID: values.nhomKienThucID,
        loaiHp: values.loaiHp,
        hocPhanTienQuyet: values.hocPhanTienQuyet
      };
      
      if (editingId) {
        // Update existing course
        await axios.put(`${API_URL}/hocphan/${editingId}`, {
          ...courseData,
          id: editingId
        });
        message.success('Cập nhật học phần thành công');
      } else {
        // Add new course
        await axios.post(`${API_URL}/hocphan`, courseData);
        message.success('Thêm học phần mới thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Lưu học phần thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = searchText
    ? courses.filter(course => 
        (course.maHp && course.maHp.toLowerCase().includes(searchText.toLowerCase())) ||
        (course.tenHp && course.tenHp.toLowerCase().includes(searchText.toLowerCase()))
      )
    : courses;

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
      title: 'Mã học phần',
      dataIndex: 'maHp',
      key: 'maHp',
      width: 120,
      sorter: (a, b) => a.maHp.localeCompare(b.maHp),
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
      title: 'Tên học phần',
      dataIndex: 'tenHp',
      key: 'tenHp',
      width: 200,
      sorter: (a, b) => a.tenHp.localeCompare(b.tenHp),
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
      title: 'Số tín chỉ',
      dataIndex: 'soTinChi',
      key: 'soTinChi',
      width: 100,
      sorter: (a, b) => a.soTinChi - b.soTinChi,
    },
    {
      title: 'Số tiết (LT/TH)',
      key: 'soTiet',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={`LT: ${record.soTietLyThuyet}, TH: ${record.soTietThucHanh}`}>
          <span>
            {record.soTietLyThuyet}/{record.soTietThucHanh}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Nhóm kiến thức',
      key: 'nhomKienThuc',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={getKnowledgeGroupName(record.nhomKienThucID)}>
          {getKnowledgeGroupName(record.nhomKienThucID)}
        </Tooltip>
      ),
      filters: knowledgeGroups.map(group => ({ text: group.tenNhom, value: group.id })),
      onFilter: (value, record) => record.nhomKienThucID === value,
    },
    {
      title: 'Loại học phần',
      dataIndex: 'loaiHp',
      key: 'loaiHp',
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
      title: 'Học phần tiên quyết',
      dataIndex: 'hocPhanTienQuyet',
      key: 'hocPhanTienQuyet',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text || 'Không có'}>
          {text || 'Không có'}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
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
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              Modal.info({
                title: `${record.tenHp} (${record.maHp})`,
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Mã học phần:</strong> {record.maHp}</p>
                    <p><strong>Tên học phần:</strong> {record.tenHp}</p>
                    <p><strong>Số tín chỉ:</strong> {record.soTinChi}</p>
                    <p><strong>Số tiết lý thuyết:</strong> {record.soTietLyThuyet}</p>
                    <p><strong>Số tiết thực hành:</strong> {record.soTietThucHanh}</p>
                    <p><strong>Nhóm kiến thức:</strong> {getKnowledgeGroupName(record.nhomKienThucID)}</p>
                    <p><strong>Loại học phần:</strong> {record.loaiHp}</p>
                    <p><strong>Học phần tiên quyết:</strong> {record.hocPhanTienQuyet || 'Không có'}</p>
                  </div>
                ),
                width: 500,
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý học phần</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên học phần..."
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
              setIsModalVisible(true);
            }}
          >
            Thêm học phần
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchCourses}
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
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
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
      `}</style>

      <Modal
        title={editingId ? "Sửa thông tin học phần" : "Thêm học phần mới"}
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
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="maHp"
              label="Mã học phần"
              rules={[{ required: true, message: 'Vui lòng nhập mã học phần!' }]}
              style={{ width: '50%' }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="soTinChi"
              label="Số tín chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="tenHp"
            label="Tên học phần"
            rules={[{ required: true, message: 'Vui lòng nhập tên học phần!' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="soTietLyThuyet"
              label="Số tiết lý thuyết"
              rules={[{ required: true, message: 'Vui lòng nhập số tiết lý thuyết!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="soTietThucHanh"
              label="Số tiết thực hành"
              rules={[{ required: true, message: 'Vui lòng nhập số tiết thực hành!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="nhomKienThucID"
              label="Nhóm kiến thức"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm kiến thức!' }]}
              style={{ width: '50%' }}
            >
              <Select placeholder="Chọn nhóm kiến thức">
                {knowledgeGroups.map(group => (
                  <Option key={group.id} value={group.id}>
                    {group.tenNhom}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="loaiHp"
              label="Loại học phần"
              rules={[{ required: true, message: 'Vui lòng chọn loại học phần!' }]}
              style={{ width: '50%' }}
            >
              <Select placeholder="Chọn loại học phần">
                <Option value="Bắt buộc">Bắt buộc</Option>
                <Option value="Tự chọn">Tự chọn</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="hocPhanTienQuyet"
            label="Học phần tiên quyết"
          >
            <Input placeholder="Nhập mã các học phần tiên quyết, ngăn cách bởi dấu phẩy" />
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

export default ManageCourses; 