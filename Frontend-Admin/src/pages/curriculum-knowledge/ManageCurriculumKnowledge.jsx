import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tooltip, Badge, Divider, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';
const API_CHITIETS = `${API_BASE_URL}/chitietkhungchuongtrinh`;
const API_KHUNGCHUONGTRINTH = `${API_BASE_URL}/khungchuongtrinh`;
const API_NHOMKIENTHUC = `${API_BASE_URL}/nhomkienthuc`;

// Thiết lập cấu hình global cho axios
axios.defaults.baseURL = API_BASE_URL;
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
    }
    return Promise.reject(error);
  }
);

const ManageCurriculumKnowledge = () => {
  // Data states
  const [curriculums, setCurriculums] = useState([]);
  const [knowledgeGroups, setKnowledgeGroups] = useState([]);
  const [curriculumDetails, setCurriculumDetails] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCurriculums();
    fetchKnowledgeGroups();
  }, []);

  // Fetch all curriculums
  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/khungchuongtrinh');
      setCurriculums(response.data);
    } catch (error) {
      console.error('Error fetching curriculums:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu khung chương trình. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all knowledge groups
  const fetchKnowledgeGroups = async () => {
    try {
      const response = await axios.get('/nhomkienthuc');
      setKnowledgeGroups(response.data);
    } catch (error) {
      console.error('Error fetching knowledge groups:', error);
    }
  };

  // Fetch curriculum details (knowledge groups for a specific curriculum)
  const fetchCurriculumDetails = async (curriculumId) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`/chitietkhungchuongtrinh/${curriculumId}`);
      
      // Enrich data with knowledge group details
      if (response.data && Array.isArray(response.data)) {
        const enrichedData = response.data.map(detail => {
          const nhomKT = knowledgeGroups.find(n => n.id === detail.idNhomKienThuc);
          return {
            ...detail,
            tenNhom: nhomKT ? nhomKT.tenNhom : 'Unknown',
            maNhom: nhomKT ? nhomKT.maNhom : 'Unknown',
            tongSoTinChi: detail.soTinChiBatBuoc + detail.soTinChiTuChon
          };
        });
        
        setCurriculumDetails(enrichedData);
      } else {
        setCurriculumDetails([]);
      }
    } catch (error) {
      console.error(`Error fetching curriculum details for ID ${curriculumId}:`, error);
      setCurriculumDetails([]);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu chi tiết khung chương trình. Vui lòng thử lại sau.'
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // View details of a curriculum
  const handleViewDetails = (curriculum) => {
    setSelectedCurriculum(curriculum);
    fetchCurriculumDetails(curriculum.id);
    setDetailsModalVisible(true);
  };

  // Handle form submission for adding/editing knowledge group
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Map form values to API fields
      const dataToSubmit = {
        id: editingId || 0,
        idKhungChuongTrinh: selectedCurriculum ? selectedCurriculum.id : values.khungChuongTrinhId,
        idNhomKienThuc: values.nhomKienThucId,
        soTinChiBatBuoc: values.soTinChiBatBuoc,
        soTinChiTuChon: values.soTinChiTuChon
      };
      
      if (editingId) {
        // Update existing record
        await axios.put(`/chitietkhungchuongtrinh/${editingId}`, dataToSubmit);
        Modal.success({
          content: 'Cập nhật thành công!'
        });
      } else {
        // Create new record
        await axios.post('/chitietkhungchuongtrinh', dataToSubmit);
        Modal.success({
          content: 'Thêm mới thành công!'
        });
      }
      
      setIsModalVisible(false);
      setEditingId(null);
      form.resetFields();
      
      // Refresh data
      if (selectedCurriculum) {
        fetchCurriculumDetails(selectedCurriculum.id);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau.'
      });
    }
  };

  // Delete a knowledge association
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/chitietkhungchuongtrinh/${id}`);
      
      // Refresh data
      if (selectedCurriculum) {
        fetchCurriculumDetails(selectedCurriculum.id);
      }
      
      Modal.success({
        content: 'Xóa thành công!'
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại sau.'
      });
    }
  };

  // Edit a knowledge association
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      nhomKienThucId: record.idNhomKienThuc,
      soTinChiBatBuoc: record.soTinChiBatBuoc,
      soTinChiTuChon: record.soTinChiTuChon
    });
    setIsModalVisible(true);
  };

  // Handle adding a new knowledge group to the selected curriculum
  const handleAddKnowledgeGroup = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Filter the main curriculum table
  const filteredCurriculums = curriculums.filter(curriculum => 
    curriculum.ten_nhom?.toLowerCase().includes(searchText.toLowerCase()) || 
    curriculum.ma_nhom?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Main table columns (Curriculum list)
  const curriculumColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Mã khung',
      dataIndex: 'ma_nhom',
      key: 'ma_nhom',
      width: 120,
      sorter: true,
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
      title: 'Tên khung chương trình',
      dataIndex: 'ten_nhom',
      key: 'ten_nhom',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: true,
    },
    {
      title: 'Số tín chỉ tối thiểu',
      dataIndex: 'soTinChiToiThieu',
      key: 'soTinChiToiThieu',
      align: 'center',
      width: 150,
      render: (value) => value ? value : 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 120,
      className: 'action-column',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => handleViewDetails(record)}
          size="small"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Detail table columns (Knowledge groups for a specific curriculum)
  const detailColumns = [
    {
      title: 'Mã nhóm',
      dataIndex: 'maNhom',
      key: 'maNhom',
      width: 100,
    },
    {
      title: 'Nhóm kiến thức',
      dataIndex: 'tenNhom',
      key: 'tenNhom',
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
      title: 'TC bắt buộc',
      dataIndex: 'soTinChiBatBuoc',
      key: 'soTinChiBatBuoc',
      align: 'center',
      width: 110,
      render: (value) => value || 0,
    },
    {
      title: 'TC tự chọn',
      dataIndex: 'soTinChiTuChon',
      key: 'soTinChiTuChon',
      align: 'center',
      width: 110,
      render: (value) => value || 0,
    },
    {
      title: 'Tổng TC',
      dataIndex: 'tongSoTinChi',
      key: 'tongSoTinChi',
      align: 'center',
      width: 100,
      render: (value) => value || 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      className: 'action-column',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc chắn muốn xóa liên kết này?`,
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  // Render knowledge group details
  const renderKnowledgeDetails = () => {
    if (!selectedCurriculum) return null;

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>{selectedCurriculum.ten_nhom}</Title>
          <p>
            <strong>Mã khung:</strong> {selectedCurriculum.ma_nhom} | 
            <strong> Số tín chỉ tối thiểu:</strong> {selectedCurriculum.soTinChiToiThieu || 0}
          </p>
        </div>
        <Divider />
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddKnowledgeGroup}
          >
            Thêm nhóm kiến thức
          </Button>
        </div>
        <Table 
          dataSource={curriculumDetails} 
          columns={detailColumns} 
          rowKey="id" 
          size="middle"
          pagination={{ 
            pageSize: 10,
            showTotal: total => `Tổng cộng ${total} bản ghi`
          }}
          bordered={false}
        />
      </div>
    );
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý khung chương trình - nhóm kiến thức</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
          <Button icon={<InfoCircleOutlined />} onClick={fetchCurriculums}>Làm mới</Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table 
          dataSource={filteredCurriculums} 
          columns={curriculumColumns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
          scroll={{ x: 1100 }}
          bordered={false}
        />
      </div>

      <style>{`
        .action-column {
          white-space: nowrap;
        }
      `}</style>

      {/* Details Modal for Knowledge Groups */}
      <Modal
        title="Chi tiết khung chương trình"
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedCurriculum(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailsModalVisible(false);
            setSelectedCurriculum(null);
          }}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {detailsLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Đang tải dữ liệu...</p>
          </div>
        ) : (
          renderKnowledgeDetails()
        )}
      </Modal>

      {/* Modal for Add/Edit Knowledge Group */}
      <Modal
        title={editingId ? "Cập nhật nhóm kiến thức" : "Thêm nhóm kiến thức vào khung chương trình"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingId(null);
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
          {!selectedCurriculum && (
            <Form.Item
              name="khungChuongTrinhId"
              label="Khung chương trình"
              rules={[{ required: true, message: 'Vui lòng chọn khung chương trình!' }]}
            >
              <Select 
                placeholder="Chọn khung chương trình"
                showSearch
                optionFilterProp="children"
              >
                {curriculums.map(curr => (
                  <Option key={curr.id} value={curr.id}>
                    {curr.ten_nhom} ({curr.ma_nhom})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.Item
            name="nhomKienThucId"
            label="Nhóm kiến thức"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm kiến thức!' }]}
          >
            <Select 
              placeholder="Chọn nhóm kiến thức"
              disabled={!!editingId}
              showSearch
              optionFilterProp="children"
            >
              {knowledgeGroups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.tenNhom} ({group.maNhom})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="soTinChiBatBuoc"
              label="Số tín chỉ bắt buộc"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ bắt buộc!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="soTinChiTuChon"
              label="Số tín chỉ tự chọn"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ tự chọn!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          {selectedCurriculum && (
            <div>
              <Divider />
              <div style={{ marginBottom: 16 }}>
                <Text strong>Khung chương trình:</Text> {selectedCurriculum?.ten_nhom} ({selectedCurriculum?.ma_nhom})
              </div>
            </div>
          )}
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingId(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
              >
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageCurriculumKnowledge; 