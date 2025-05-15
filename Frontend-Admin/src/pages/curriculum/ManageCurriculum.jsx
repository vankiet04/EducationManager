import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, DatePicker, Divider, Tree, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
    }
    return Promise.reject(error);
  }
);

const ManageCurriculum = () => {
  const [curriculumGroups, setCurriculumGroups] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [form] = Form.useForm();
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [hierarchicalData, setHierarchicalData] = useState(null);

  // Mô phỏng dữ liệu khoa
  const mockDepartments = [
    { id: 1, ma_khoa: 'CNTT', ten_khoa: 'Công nghệ thông tin' },
    { id: 2, ma_khoa: 'KTPM', ten_khoa: 'Kỹ thuật phần mềm' },
    { id: 3, ma_khoa: 'MATH', ten_khoa: 'Toán - Tin học' },
  ];

  // Mô phỏng dữ liệu ngành học
  const mockMajors = [
    { id: 1, ma_nganh: 'CNTT', ten_nganh: 'Công nghệ thông tin', khoa_id: 1 },
    { id: 2, ma_nganh: 'KTPM', ten_nganh: 'Kỹ thuật phần mềm', khoa_id: 2 },
    { id: 3, ma_nganh: 'HTTT', ten_nganh: 'Hệ thống thông tin', khoa_id: 1 },
    { id: 4, ma_nganh: 'KHMT', ten_nganh: 'Khoa học máy tính', khoa_id: 1 },
    { id: 5, ma_nganh: 'TH', ten_nganh: 'Tin học', khoa_id: 3 },
  ];

  // Mô phỏng dữ liệu khung chương trình
  const mockCurriculums = [
    {
      id: 1,
      ma_khung: 'CNTT2020',
      ten_khung: 'Khung chương trình ngành CNTT (K2020)',
      nganh_id: 1,
      ma_nganh: 'CNTT',
      ten_nganh: 'Công nghệ thông tin',
      khoa_id: 1,
      ma_khoa: 'CNTT',
      ten_khoa: 'Công nghệ thông tin',
      nam_bat_dau: 2020,
      tong_so_tin_chi: 145,
      hinh_thuc_dao_tao: 'Chính quy',
      thoi_gian_dao_tao: 4,
      trinh_do_dao_tao: 'Đại học',
      ngay_ban_hanh: '2020-05-15',
      nguoi_ky: 'PGS.TS Nguyễn Văn A',
      mo_ta: 'Khung chương trình đào tạo chuẩn ngành CNTT theo chuẩn CDIO',
      trang_thai: 1
    },
    {
      id: 2,
      ma_khung: 'KTPM2021',
      ten_khung: 'Khung chương trình ngành KTPM (K2021)',
      nganh_id: 2,
      ma_nganh: 'KTPM',
      ten_nganh: 'Kỹ thuật phần mềm',
      khoa_id: 2,
      ma_khoa: 'KTPM',
      ten_khoa: 'Kỹ thuật phần mềm',
      nam_bat_dau: 2021,
      tong_so_tin_chi: 150,
      hinh_thuc_dao_tao: 'Chính quy',
      thoi_gian_dao_tao: 4,
      trinh_do_dao_tao: 'Đại học',
      ngay_ban_hanh: '2021-04-10',
      nguoi_ky: 'PGS.TS Trần Văn B',
      mo_ta: 'Khung chương trình đào tạo chuẩn ngành KTPM theo hướng ứng dụng',
      trang_thai: 1
    },
    {
      id: 3,
      ma_khung: 'HTTT2022',
      ten_khung: 'Khung chương trình ngành HTTT (K2022)',
      nganh_id: 3,
      ma_nganh: 'HTTT',
      ten_nganh: 'Hệ thống thông tin',
      khoa_id: 1,
      ma_khoa: 'CNTT',
      ten_khoa: 'Công nghệ thông tin',
      nam_bat_dau: 2022,
      tong_so_tin_chi: 140,
      hinh_thuc_dao_tao: 'Chính quy',
      thoi_gian_dao_tao: 4,
      trinh_do_dao_tao: 'Đại học',
      ngay_ban_hanh: '2022-03-20',
      nguoi_ky: 'PGS.TS Nguyễn Văn A',
      mo_ta: 'Khung chương trình đào tạo chuẩn ngành HTTT theo chuẩn ACM',
      trang_thai: 1
    },
    {
      id: 4,
      ma_khung: 'TH2022',
      ten_khung: 'Khung chương trình ngành Tin học (K2022)',
      nganh_id: 5,
      ma_nganh: 'TH',
      ten_nganh: 'Tin học',
      khoa_id: 3,
      ma_khoa: 'MATH',
      ten_khoa: 'Toán - Tin học',
      nam_bat_dau: 2022,
      tong_so_tin_chi: 130,
      hinh_thuc_dao_tao: 'Chính quy',
      thoi_gian_dao_tao: 4,
      trinh_do_dao_tao: 'Đại học',
      ngay_ban_hanh: '2022-02-25',
      nguoi_ky: 'PGS.TS Lê Văn C',
      mo_ta: 'Khung chương trình đào tạo ngành Tin học theo định hướng nghiên cứu',
      trang_thai: 0
    }
  ];

  // Mock curriculum groups (nhóm kiến thức trong CTDT)
  const mockCurriculumGroups = [
    {
      id: 1,
      ctdt_id: 1,
      ma_nhom: 'CNTT-DC',
      ten_nhom: 'Khối kiến thức đại cương',
      so_tin_chi_toi_thieu: 30,
      ten_ctdt: 'Khung chương trình ngành CNTT (K2020)'
    },
    {
      id: 2,
      ctdt_id: 1,
      ma_nhom: 'CNTT-CSN',
      ten_nhom: 'Khối kiến thức cơ sở ngành',
      so_tin_chi_toi_thieu: 24,
      ten_ctdt: 'Khung chương trình ngành CNTT (K2020)'
    },
    {
      id: 3,
      ctdt_id: 1,
      ma_nhom: 'CNTT-CN',
      ten_nhom: 'Khối kiến thức chuyên ngành',
      so_tin_chi_toi_thieu: 36,
      ten_ctdt: 'Khung chương trình ngành CNTT (K2020)'
    },
    {
      id: 4,
      ctdt_id: 2,
      ma_nhom: 'KTPM-DC',
      ten_nhom: 'Khối kiến thức đại cương',
      so_tin_chi_toi_thieu: 28,
      ten_ctdt: 'Khung chương trình ngành KTPM (K2021)'
    },
    {
      id: 5,
      ctdt_id: 2,
      ma_nhom: 'KTPM-CSN',
      ten_nhom: 'Khối kiến thức cơ sở ngành',
      so_tin_chi_toi_thieu: 26,
      ten_ctdt: 'Khung chương trình ngành KTPM (K2021)'
    },
    {
      id: 6,
      ctdt_id: 3,
      ma_nhom: 'HTTT-DC',
      ten_nhom: 'Khối kiến thức đại cương',
      so_tin_chi_toi_thieu: 32,
      ten_ctdt: 'Khung chương trình ngành HTTT (K2022)'
    }
  ];

  // Load data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch curriculums
      const curriculumsResponse = await axios.get('/khungchuongtrinh');
      setCurriculums(curriculumsResponse.data);

      // Fetch curriculum groups
      const groupsResponse = await axios.get('/khungchuongtrinh-nhomkienthuc');
      setCurriculumGroups(groupsResponse.data);
      setDepartments(mockDepartments);
      setMajors(mockMajors);
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

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Handle curriculum filter
  const handleCurriculumFilter = (value) => {
    setCurriculumFilter(value);
  };

  // Filter data by search text and curriculum
  const getFilteredData = () => {
    let filteredData = [...curriculumGroups];
    
    // Filter by search text
    if (searchText) {
      filteredData = filteredData.filter(item => 
        item.idMaNhom.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        item.idKhungChuongTrinh.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filter by curriculum
    if (curriculumFilter !== 'all') {
      const ctdtId = parseInt(curriculumFilter);
      filteredData = filteredData.filter(item => item.idKhungChuongTrinh === ctdtId);
    }
    
    return filteredData;
  };

  // Handle edit curriculum group
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ctdt_id: record.ctdt_id,
      ma_nhom: record.ma_nhom,
      ten_nhom: record.ten_nhom,
      so_tin_chi_toi_thieu: record.so_tin_chi_toi_thieu
    });
    setIsModalVisible(true);
  };

  // Handle delete curriculum group
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhóm kiến thức này?',
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.delete(`/api/nhom-kien-thuc/${id}`);
          
          const updatedGroups = curriculumGroups.filter(group => group.id !== id);
          setCurriculumGroups(updatedGroups);
          Modal.success({
            content: 'Xóa nhóm kiến thức thành công'
          });
        } catch (error) {
          console.error('Error deleting curriculum group:', error);
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể xóa nhóm kiến thức. Vui lòng thử lại sau.'
          });
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
      // Get curriculum info
      const curriculum = curriculums.find(c => c.id === values.ctdt_id);
      
      if (editingId) {
        // Update existing curriculum group
        // In a real application, this would be an API call
        // await axios.put(`/api/nhom-kien-thuc/${editingId}`, values);
        
        const updatedGroups = curriculumGroups.map(group => {
          if (group.id === editingId) {
            return { 
              ...group, 
              ...values, 
              ten_ctdt: curriculum.ten_ctdt
            };
          }
          return group;
        });
        
        setCurriculumGroups(updatedGroups);
        Modal.success({
          content: 'Cập nhật nhóm kiến thức thành công'
        });
      } else {
        // Check if ma_nhom already exists for the selected curriculum
        const exists = curriculumGroups.some(
          group => group.ma_nhom === values.ma_nhom && group.ctdt_id === values.ctdt_id
        );
        
        if (exists) {
          Modal.error({
            content: 'Mã nhóm đã tồn tại trong chương trình đào tạo này!'
          });
          setLoading(false);
          return;
        }
        
        // Create new curriculum group
        // In a real application, this would be an API call
        // const response = await axios.post('/api/nhom-kien-thuc', values);
        // const newGroup = response.data;
        
        const newGroup = {
          id: Math.max(...curriculumGroups.map(group => group.id), 0) + 1,
          ...values,
          ten_ctdt: curriculum.ten_ctdt
        };
        
        setCurriculumGroups([...curriculumGroups, newGroup]);
        Modal.success({
          content: 'Thêm nhóm kiến thức mới thành công'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
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
      // Get curriculum details
      const curriculumResponse = await axios.get(`/khungchuongtrinh/${record.idKhungChuongTrinh}`);
      const curriculum = curriculumResponse.data;

      // Get knowledge groups for this curriculum
      const knowledgeGroupsResponse = await axios.get(`/khungchuongtrinh-nhomkienthuc/khungchuongtrinh/${record.idKhungChuongTrinh}`);
      const knowledgeGroups = knowledgeGroupsResponse.data;

      // Get all knowledge groups details
      const nhomKienThucResponse = await axios.get('/nhomkienthuc');
      const nhomKienThucList = nhomKienThucResponse.data;

      // Get all courses
      const coursesResponse = await axios.get('/hocphan');
      const courses = coursesResponse.data;

      // Build hierarchical data
      const hierarchicalData = {
        curriculum: curriculum,
        groups: await Promise.all(knowledgeGroups.map(async (group) => {
          const nhomKienThuc = nhomKienThucList.find(n => n.id === group.idMaNhom);
          const groupCourses = courses.filter(course => course.nhomKienThucID === group.idMaNhom);
          
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
    setSelectedRecord(record);
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
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Chương trình đào tạo',
      dataIndex: 'idKhungChuongTrinh',
      key: 'idKhungChuongTrinh',
      width: 250,
      ellipsis: true,
      sorter: (a, b) => a.idKhungChuongTrinh - b.idKhungChuongTrinh,
      render: (id) => {
        const curriculum = curriculums.find(c => c.id === id);
        const text = curriculum ? curriculum.ten_nhom : 'N/A';
        return (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'idMaNhom',
      key: 'idMaNhom',
      width: 120,
      sorter: (a, b) => a.idMaNhom - b.idMaNhom,
    },
    {
      title: 'Số tín chỉ bắt buộc',
      dataIndex: 'soTinChiBatBuoc',
      key: 'soTinChiBatBuoc',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.soTinChiBatBuoc - b.soTinChiBatBuoc,
    },
    {
      title: 'Số tín chỉ tự chọn',
      dataIndex: 'soTinChiTuChon',
      key: 'soTinChiTuChon',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.soTinChiTuChon - b.soTinChiTuChon,
    },
    {
      title: 'Thao tác',
      key: 'action',
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
          <h3>Thông tin khung chương trình</h3>
          <p><strong>Mã khung:</strong> {hierarchicalData.curriculum.ma_nhom}</p>
          <p><strong>Tên khung:</strong> {hierarchicalData.curriculum.ten_nhom}</p>
          <p><strong>Số tín chỉ tối thiểu:</strong> {hierarchicalData.curriculum.soTinChiToiThieu}</p>
        </div>

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
        <Title level={2}>Quản lý nhóm kiến thức</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          <Select
            placeholder="Chương trình đào tạo"
            style={{ width: 250 }}
            value={curriculumFilter}
            onChange={handleCurriculumFilter}
          >
            <Option value="all">Tất cả chương trình đào tạo</Option>
            {curriculums.map(curriculum => (
              <Option key={curriculum.id} value={curriculum.id}>
                {curriculum.ten_nhom}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
      />

      <style>{`
        .action-column {
          white-space: nowrap;
        }
      `}</style>

      <Modal
        title={editingId ? "Cập nhật nhóm kiến thức" : "Thêm nhóm kiến thức mới"}
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
              disabled={!!editingId}
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
                {editingId ? 'Cập nhật' : 'Thêm mới'}
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