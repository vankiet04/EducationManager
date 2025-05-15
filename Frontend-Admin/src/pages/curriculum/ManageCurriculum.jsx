import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, DatePicker, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, TeamOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

  // Fetch data from API or use mock data
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real application, these would be API calls
      // const curriculumsResponse = await axios.get('/api/ctdt');
      // const groupsResponse = await axios.get('/api/nhom-kien-thuc');
      
      // setCurriculums(curriculumsResponse.data);
      // setCurriculumGroups(groupsResponse.data);
      
      // Using mock data for now
      setCurriculums(mockCurriculums);
      setCurriculumGroups(mockCurriculumGroups);
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
        item.ma_nhom.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ten_nhom.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Filter by curriculum
    if (curriculumFilter !== 'all') {
      const ctdtId = parseInt(curriculumFilter);
      filteredData = filteredData.filter(item => item.ctdt_id === ctdtId);
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
      dataIndex: 'ten_ctdt',
      key: 'ten_ctdt',
      width: 250,
      ellipsis: true,
      sorter: (a, b) => a.ten_ctdt.localeCompare(b.ten_ctdt),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'ma_nhom',
      key: 'ma_nhom',
      width: 120,
      sorter: (a, b) => a.ma_nhom.localeCompare(b.ma_nhom),
    },
    {
      title: 'Tên nhóm kiến thức',
      dataIndex: 'ten_nhom',
      key: 'ten_nhom',
      width: 250,
      ellipsis: true,
      sorter: (a, b) => a.ten_nhom.localeCompare(b.ten_nhom),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Số tín chỉ tối thiểu',
      dataIndex: 'so_tin_chi_toi_thieu',
      key: 'so_tin_chi_toi_thieu',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.so_tin_chi_toi_thieu - b.so_tin_chi_toi_thieu,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
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
                title: `Chi tiết nhóm kiến thức: ${record.ten_nhom}`,
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Chương trình đào tạo:</strong> {record.ten_ctdt}</p>
                    <p><strong>Mã nhóm:</strong> {record.ma_nhom}</p>
                    <p><strong>Tên nhóm:</strong> {record.ten_nhom}</p>
                    <p><strong>Số tín chỉ tối thiểu:</strong> {record.so_tin_chi_toi_thieu}</p>
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
              <Option key={curriculum.id} value={curriculum.id.toString()}>
                {curriculum.ten_ctdt}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Thêm nhóm kiến thức
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
          >
            Làm mới
          </Button>
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
                  {curriculum.ten_ctdt}
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
    </Card>
  );
};

export default ManageCurriculum; 