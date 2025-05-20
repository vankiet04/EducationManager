import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tooltip, Badge, Divider, Spin, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  InfoCircleOutlined, EyeOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

// API base URL
const API_BASE_URL = 'http://localhost:8080';
const API_CHITIETS = `${API_BASE_URL}/api/chitietkhungchuongtrinh`;
const API_KHUNGCHUONGTRINTH = `${API_BASE_URL}/api/khungchuongtrinh`;
const API_NHOMKIENTHUC = `${API_BASE_URL}/api/nhomkienthuc`;

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
  const [coursesData, setCoursesData] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // New state for batch adding curriculum details
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [selectedKnowledgeGroups, setSelectedKnowledgeGroups] = useState([]);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);

  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();

  useEffect(() => {
    fetchCurriculums();
    fetchKnowledgeGroups();
  }, []);

  // Fetch all curriculums
  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/khungchuongtrinh');
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
      const response = await axios.get('/api/nhomkienthuc');
      setKnowledgeGroups(response.data);
    } catch (error) {
      console.error('Error fetching knowledge groups:', error);
    }
  };

  // Fetch curriculum details (knowledge groups for a specific curriculum)
  const fetchCurriculumDetails = async (curriculumId) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`/api/chitietkhungchuongtrinh/${curriculumId}`);
      
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
        await axios.put(`/api/chitietkhungchuongtrinh/${editingId}`, dataToSubmit);
        Modal.success({
          content: 'Cập nhật thành công!'
        });
      } else {
        // Create new record
        await axios.post('/api/chitietkhungchuongtrinh', dataToSubmit);
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
      await axios.delete(`/api/chitietkhungchuongtrinh/${id}`);
      
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

  // Show the batch add modal
  const showBatchAddModal = async () => {
    setBatchModalVisible(true);
    batchForm.resetFields();
    setSelectedKnowledgeGroups([]);
    setSelectedCurriculumId(null);
    
    // Fetch courses for credit calculation
    await fetchCoursesData();
  };
  
  // Fetch all courses data for credit calculation
  const fetchCoursesData = async () => {
    try {
      const response = await axios.get('/api/hocphan');
      setCoursesData(response.data);
    } catch (error) {
      console.error('Error fetching courses data:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu học phần. Vui lòng thử lại sau.'
      });
    }
  };
  
  // Handle curriculum selection in batch add modal
  const handleBatchCurriculumChange = (curriculumId) => {
    setSelectedCurriculumId(curriculumId);
  };
  
  // Handle knowledge groups selection in batch add modal
  const handleBatchKnowledgeGroupsChange = (selectedGroupIds) => {
    setSelectedKnowledgeGroups(selectedGroupIds);
  };
  
  // Calculate credits for a knowledge group based on courses
  const calculateCreditsForGroup = (knowledgeGroupId) => {
    // Filter courses that belong to this knowledge group
    const groupCourses = coursesData.filter(course => 
      course.nhomKienThucID === knowledgeGroupId
    );
    
    // Calculate required and optional credits
    const requiredCredits = groupCourses
      .filter(course => course.loaiHp === 'Bắt buộc')
      .reduce((total, course) => total + (course.soTinChi || 0), 0);
    
    const optionalCredits = groupCourses
      .filter(course => course.loaiHp === 'Tự chọn')
      .reduce((total, course) => total + (course.soTinChi || 0), 0);
    
    return {
      requiredCredits,
      optionalCredits,
      totalCredits: requiredCredits + optionalCredits
    };
  };
  
  // Submit batch add form
  const handleBatchSubmit = async () => {
    try {
      const values = await batchForm.validateFields();
      setLoading(true);
      
      // Create detail records for each selected knowledge group
      const detailsToAdd = selectedKnowledgeGroups.map(groupId => {
        const credits = calculateCreditsForGroup(groupId);
        return {
          idKhungChuongTrinh: values.curriculumId,
          idNhomKienThuc: groupId,
          soTinChiBatBuoc: credits.requiredCredits,
          soTinChiTuChon: credits.optionalCredits
        };
      });
      
      // Submit all details to API
      for (const detail of detailsToAdd) {
        await axios.post('/api/chitietkhungchuongtrinh', detail);
      }
      
      // Update minimum credits for the curriculum
      await updateCurriculumMinimumCredits(values.curriculumId);
      
      Modal.success({
        content: 'Thêm chi tiết khung chương trình thành công'
      });
      
      setBatchModalVisible(false);
      batchForm.resetFields();
      fetchCurriculums(); // Refresh curriculums
      
      // If the details modal is open, refresh the details
      if (selectedCurriculum && selectedCurriculum.id === values.curriculumId) {
        fetchCurriculumDetails(selectedCurriculum.id);
      }
    } catch (error) {
      console.error('Error adding curriculum details:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể thêm chi tiết khung chương trình. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update curriculum minimum credits
  const updateCurriculumMinimumCredits = async (curriculumId) => {
    try {
      // Get all details for this curriculum
      const response = await axios.get(`/api/chitietkhungchuongtrinh/${curriculumId}`);
      const details = response.data;
      
      // Calculate total credits
      const totalCredits = details.reduce(
        (total, detail) => total + detail.soTinChiBatBuoc + detail.soTinChiTuChon, 0
      );
      
      // Get current curriculum data
      const curriculumResponse = await axios.get(`/api/khungchuongtrinh/${curriculumId}`);
      const curriculumData = curriculumResponse.data[0];
      
      // Update minimum credits
      await axios.put(`/api/khungchuongtrinh/${curriculumId}`, {
        ...curriculumData,
        soTinChiToiThieu: totalCredits
      });
      
    } catch (error) {
      console.error('Error updating curriculum minimum credits:', error);
    }
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
    }
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
          {/* Button temporarily hidden per request */}
          {/* 
          <Button 
            type="primary"
            icon={<AppstoreAddOutlined />}
            onClick={showBatchAddModal}
          >
            Thêm chi tiết khung chương trình
          </Button>
          */}
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
      
      {/* Batch Add Modal for adding multiple knowledge groups at once */}
      <Modal
        title="Thêm chi tiết khung chương trình"
        open={batchModalVisible}
        onCancel={() => {
          setBatchModalVisible(false);
          batchForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={batchForm}
          layout="vertical"
          onFinish={handleBatchSubmit}
        >
          <Form.Item
            name="curriculumId"
            label="Khung chương trình"
            rules={[{ required: true, message: 'Vui lòng chọn khung chương trình!' }]}
          >
            <Select 
              placeholder="Chọn khung chương trình"
              onChange={handleBatchCurriculumChange}
              showSearch
              optionFilterProp="children"
            >
              {curriculums.map(curriculum => (
                <Option key={curriculum.id} value={curriculum.id}>
                  {curriculum.ten_nhom} ({curriculum.ma_nhom})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="knowledgeGroups"
            label="Nhóm kiến thức"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một nhóm kiến thức!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn nhóm kiến thức"
              onChange={handleBatchKnowledgeGroupsChange}
              disabled={!selectedCurriculumId}
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {knowledgeGroups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.tenNhom} ({group.maNhom})
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          {selectedKnowledgeGroups.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h4>Tóm tắt thông tin tín chỉ:</h4>
              <Table
                dataSource={selectedKnowledgeGroups.map(groupId => {
                  const group = knowledgeGroups.find(g => g.id === groupId);
                  const credits = calculateCreditsForGroup(groupId);
                  return {
                    id: groupId,
                    name: group ? group.tenNhom : '',
                    code: group ? group.maNhom : '',
                    requiredCredits: credits.requiredCredits,
                    optionalCredits: credits.optionalCredits,
                    totalCredits: credits.totalCredits
                  };
                })}
                rowKey="id"
                size="small"
                pagination={false}
                columns={[
                  {
                    title: 'Mã nhóm',
                    dataIndex: 'code',
                    key: 'code',
                    width: 100
                  },
                  {
                    title: 'Tên nhóm kiến thức',
                    dataIndex: 'name',
                    key: 'name'
                  },
                  {
                    title: 'TC bắt buộc',
                    dataIndex: 'requiredCredits',
                    key: 'requiredCredits',
                    width: 110,
                    align: 'center'
                  },
                  {
                    title: 'TC tự chọn',
                    dataIndex: 'optionalCredits',
                    key: 'optionalCredits',
                    width: 110,
                    align: 'center'
                  },
                  {
                    title: 'Tổng TC',
                    dataIndex: 'totalCredits',
                    key: 'totalCredits',
                    width: 100,
                    align: 'center'
                  }
                ]}
                summary={pageData => {
                  let totalRequired = 0;
                  let totalOptional = 0;
                  
                  pageData.forEach(({ requiredCredits, optionalCredits }) => {
                    totalRequired += requiredCredits;
                    totalOptional += optionalCredits;
                  });
                  
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={2}><strong>Tổng cộng</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center"><strong>{totalRequired}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} align="center"><strong>{totalOptional}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={3} align="center"><strong>{totalRequired + totalOptional}</strong></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
              <Divider />
              <div style={{ marginBottom: 10 }}>
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Số tín chỉ được tính tự động dựa trên các học phần thuộc nhóm kiến thức
                </Text>
              </div>
              <div>
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Tổng số tín chỉ sẽ được cập nhật vào số tín chỉ tối thiểu của khung chương trình
                </Text>
              </div>
            </div>
          )}
          
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space>
              <Button
                onClick={() => {
                  setBatchModalVisible(false);
                  batchForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={selectedKnowledgeGroups.length === 0}
              >
                Thêm chi tiết
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageCurriculumKnowledge; 