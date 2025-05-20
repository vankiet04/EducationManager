import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tag, Tooltip, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// API base URL
const API_URL = 'http://localhost:8080/api';

const ManageKnowledgeGroups = () => {
  const [knowledgeGroups, setKnowledgeGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchKnowledgeGroups();
  }, []);

  // Fetch knowledge groups from API
  const fetchKnowledgeGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/nhomkienthuc`);
      setKnowledgeGroups(response.data);
    } catch (error) {
      console.error('Error fetching knowledge groups:', error);
      message.error('Không thể tải dữ liệu nhóm kiến thức');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a knowledge group
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      maNhom: record.maNhom,
      tenNhom: record.tenNhom,
      trangThai: record.trangThai
    });
    setIsModalVisible(true);
  };

  // Handle deleting a knowledge group
  const handleDelete = (groupId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhóm kiến thức này? Nhóm sẽ bị ẩn khỏi hệ thống nhưng không bị xóa hoàn toàn.',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${API_URL}/nhomkienthuc/${groupId}`);
          message.success('Xóa nhóm kiến thức thành công');
          fetchKnowledgeGroups(); // Refresh the list
        } catch (error) {
          console.error('Error deleting knowledge group:', error);
          message.error('Xóa nhóm kiến thức thất bại');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle toggling status
  const handleToggleStatus = async (record) => {
    const newStatus = record.trangThai === 1 ? 0 : 1;
    setLoading(true);
    try {
      const updatedRecord = { ...record, trangThai: newStatus };
      await axios.put(`${API_URL}/nhomkienthuc/${record.id}`, updatedRecord);
      message.success(`Nhóm kiến thức đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`);
      fetchKnowledgeGroups(); // Refresh the list
    } catch (error) {
      console.error('Error updating knowledge group status:', error);
      message.error('Cập nhật trạng thái thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const knowledgeGroupData = {
        maNhom: values.maNhom,
        tenNhom: values.tenNhom,
        trangThai: values.trangThai
      };
      
      if (editingId) {
        // Update existing knowledge group
        await axios.put(`${API_URL}/nhomkienthuc/${editingId}`, {
          ...knowledgeGroupData,
          id: editingId
        });
        message.success('Cập nhật nhóm kiến thức thành công');
      } else {
        // Add new knowledge group
        await axios.post(`${API_URL}/nhomkienthuc`, knowledgeGroupData);
        message.success('Thêm nhóm kiến thức mới thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchKnowledgeGroups(); // Refresh the list
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Lưu nhóm kiến thức thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text and active status
  const filteredData = knowledgeGroups
    // Filter out inactive records (trangThai=0)
    .filter(group => group.trangThai === 1)
    // Then apply search text filter
    .filter(group => 
      !searchText || (
        (group.maNhom && group.maNhom.toLowerCase().includes(searchText.toLowerCase())) ||
        (group.tenNhom && group.tenNhom.toLowerCase().includes(searchText.toLowerCase()))
      )
    );

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
      title: 'Mã nhóm',
      dataIndex: 'maNhom',
      key: 'maNhom',
      width: 120,
      sorter: (a, b) => a.maNhom.localeCompare(b.maNhom),
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
      title: 'Tên nhóm kiến thức',
      dataIndex: 'tenNhom',
      key: 'tenNhom',
      width: 250,
      sorter: (a, b) => a.tenNhom.localeCompare(b.tenNhom),
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
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      align: 'center',
      render: trangThai => (
        <Tag color={trangThai === 1 ? 'green' : 'red'}>
          {trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 1 },
        { text: 'Không hoạt động', value: 0 },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
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
                title: `${record.tenNhom} (${record.maNhom})`,
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Mã nhóm:</strong> {record.maNhom}</p>
                    <p><strong>Tên nhóm kiến thức:</strong> {record.tenNhom}</p>
                    <p><strong>Trạng thái:</strong> {record.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
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
        <Title level={2}>Quản lý nhóm kiến thức</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên nhóm..."
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
                trangThai: 1,
                soTinChiToiThieu: 12
              });
              setIsModalVisible(true);
            }}
          >
            Thêm nhóm kiến thức
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchKnowledgeGroups}
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
          scroll={{ x: 1000 }}
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
        title={editingId ? "Sửa thông tin nhóm kiến thức" : "Thêm nhóm kiến thức mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="maNhom"
              label="Mã nhóm"
              rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
              style={{ width: '100%' }}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="tenNhom"
            label="Tên nhóm kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm kiến thức!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Không hoạt động</Option>
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

export default ManageKnowledgeGroups; 