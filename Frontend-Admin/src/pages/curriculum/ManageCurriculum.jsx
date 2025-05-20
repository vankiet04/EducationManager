import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tooltip, Spin, Divider } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

// API base URL
const API_URL = 'http://localhost:8080';

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
    }
    return Promise.reject(error);
  }
);

const ManageCurriculum = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [hierarchicalData, setHierarchicalData] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch thongtinchung data
      const thongtinchungResponse = await axios.get('/api/thongTinChung');
      setCurriculums(thongtinchungResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (values.id) {
        // Update existing curriculum group
        await axios.put(`/api/chitietkhungchuongtrinh/${values.id}`, values);
        Modal.success({
          content: 'Cập nhật nhóm kiến thức thành công'
        });
      } else {
        // Create new curriculum group
        await axios.post('/api/chitietkhungchuongtrinh', values);
        Modal.success({
          content: 'Thêm nhóm kiến thức mới thành công'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchData(); // Refresh data after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể lưu nhóm kiến thức. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch hierarchical data for a curriculum
  const fetchHierarchicalData = async (record) => {
    setDetailsLoading(true);
    try {
      // Get curriculum details from khungchuongtrinh
      const curriculumResponse = await axios.get(`/api/khungchuongtrinh/${record.id}`);
      const curriculum = curriculumResponse.data[0]; // Get first item from the list

      // Get knowledge groups for this curriculum
      const knowledgeGroupsResponse = await axios.get(`/api/chitietkhungchuongtrinh/${curriculum.id}`);
      const knowledgeGroups = knowledgeGroupsResponse.data;

      // Get all knowledge groups details
      const nhomKienThucResponse = await axios.get('/api/nhomkienthuc');
      const nhomKienThucList = nhomKienThucResponse.data;

      // Get all courses
      const coursesResponse = await axios.get('/api/hocphan');
      const courses = coursesResponse.data;

      // Build hierarchical data
      const hierarchicalData = {
        curriculum: curriculum,
        generalInfo: record,
        groups: await Promise.all(knowledgeGroups.map(async (group) => {
          const nhomKienThuc = nhomKienThucList.find(n => n.id === group.idNhomKienThuc);
          const groupCourses = courses.filter(course => course.nhomKienThucID === group.idNhomKienThuc);
          
          return {
            ...group,
            nhomKienThuc,
            courses: groupCourses
          };
        }))
      };

      setHierarchicalData(hierarchicalData);
    } catch (error) {
      console.error('Error fetching hierarchical data:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải dữ liệu chi tiết. Vui lòng thử lại sau.'
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle viewing details
  const handleViewDetails = async (record) => {
    setDetailsModalVisible(true);
    await fetchHierarchicalData(record);
  };

  // Table columns
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
      title: 'Mã CTĐT',
      dataIndex: 'maCtdt',
      key: 'maCtdt',
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
      title: 'Tên CTĐT',
      dataIndex: 'tenCtdt',
      key: 'tenCtdt',
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
      title: 'Ngành',
      dataIndex: 'nganh',
      key: 'nganh',
      width: 180,
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
      title: 'Mã ngành',
      dataIndex: 'maNganh',
      key: 'maNganh',
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
      title: 'Tổng tín chỉ',
      dataIndex: 'tongTinChi',
      key: 'tongTinChi',
      width: 120,
      align: 'center',
      sorter: true,
      render: (value) => <span style={{ fontWeight: 'bold' }}>{value}</span>
    },
    {
      title: 'Năm ban hành',
      dataIndex: 'namBanHanh',
      key: 'namBanHanh',
      width: 130,
      align: 'center',
      sorter: true,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Render hierarchical details
  const renderHierarchicalDetails = () => {
    if (!hierarchicalData) return null;

    return (
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <div style={{ marginBottom: 16 }}>
          <h3>Thông tin chung</h3>
          <p><strong>Mã CTĐT:</strong> {hierarchicalData.generalInfo.maCtdt}</p>
          <p><strong>Tên CTĐT:</strong> {hierarchicalData.generalInfo.tenCtdt}</p>
          <p><strong>Ngành:</strong> {hierarchicalData.generalInfo.nganh}</p>
          <p><strong>Mã ngành:</strong> {hierarchicalData.generalInfo.maNganh}</p>
          <p><strong>Khoa quản lý:</strong> {hierarchicalData.generalInfo.khoaQuanLy}</p>
          <p><strong>Hệ đào tạo:</strong> {hierarchicalData.generalInfo.heDaoTao}</p>
          <p><strong>Trình độ:</strong> {hierarchicalData.generalInfo.trinhDo}</p>
          <p><strong>Tổng tín chỉ:</strong> {hierarchicalData.generalInfo.tongTinChi}</p>
          <p><strong>Thời gian đào tạo:</strong> {hierarchicalData.generalInfo.thoiGianDaoTao}</p>
          <p><strong>Năm ban hành:</strong> {hierarchicalData.generalInfo.namBanHanh}</p>
        </div>

        <Divider />

        <div>
          <h3>Nhóm kiến thức và học phần</h3>
          {hierarchicalData.groups.map(group => (
            <div key={group.id} style={{ marginBottom: 24, backgroundColor: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <h4>
                {group.nhomKienThuc?.tenNhom || 'N/A'} 
                <span style={{ marginLeft: 8, fontSize: '0.9em', color: '#666' }}>
                  (Mã nhóm: {group.nhomKienThuc?.maNhom})
                </span>
              </h4>
              <p>
                <strong>Số tín chỉ bắt buộc:</strong> {group.soTinChiBatBuoc} | 
                <strong> Số tín chỉ tự chọn:</strong> {group.soTinChiTuChon}
              </p>
              
              <Table
                size="small"
                dataSource={group.courses}
                rowKey="id"
                pagination={false}
                style={{ marginTop: 8 }}
                columns={[
                  {
                    title: 'Mã HP',
                    dataIndex: 'maHp',
                    width: 100,
                  },
                  {
                    title: 'Tên học phần',
                    dataIndex: 'tenHp',
                    ellipsis: true,
                  },
                  {
                    title: 'Số TC',
                    dataIndex: 'soTinChi',
                    width: 80,
                    align: 'center',
                  },
                  {
                    title: 'LT',
                    dataIndex: 'soTietLyThuyet',
                    width: 70,
                    align: 'center',
                  },
                  {
                    title: 'TH',
                    dataIndex: 'soTietThucHanh',
                    width: 70,
                    align: 'center',
                  }
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý khung chương trình</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            allowClear
          />
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={curriculums}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="middle"
          scroll={{ x: 1300 }}
          bordered={false}
        />
      </div>

      <style>{`
        .action-column {
          white-space: nowrap;
        }
      `}</style>

      <Modal
        title="Thêm nhóm kiến thức mới"
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
          <Form.Item
            name="ctdt_id"
            label="Chương trình đào tạo"
            rules={[{ required: true, message: 'Vui lòng chọn chương trình đào tạo!' }]}
          >
            <Select 
              placeholder="Chọn chương trình đào tạo"
              showSearch
              optionFilterProp="children"
            >
              {curriculums.map(curriculum => (
                <Option key={curriculum.id} value={curriculum.id}>
                  {curriculum.ten_nhom}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="ma_nhom"
              label="Mã nhóm"
              rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
              style={{ width: '40%' }}
            >
              <Input placeholder="Ví dụ: CNTT-DC" />
            </Form.Item>

            <Form.Item
              name="so_tin_chi_toi_thieu"
              label="Số tín chỉ tối thiểu"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ tối thiểu!' }]}
              style={{ width: '60%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Ví dụ: 30" />
            </Form.Item>
          </div>

          <Form.Item
            name="ten_nhom"
            label="Tên nhóm kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm kiến thức!' }]}
          >
            <Input placeholder="Ví dụ: Khối kiến thức đại cương" />
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
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Thêm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết khung chương trình"
        open={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setHierarchicalData(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailsModalVisible(false);
            setHierarchicalData(null);
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
          renderHierarchicalDetails()
        )}
      </Modal>
    </Card>
  );
};

export default ManageCurriculum; 