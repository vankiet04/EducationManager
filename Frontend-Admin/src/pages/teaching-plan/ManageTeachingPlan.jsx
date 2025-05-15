import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Select, Tag, Modal, Form, Tooltip, Divider, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const ManageTeachingPlan = () => {
  const [plans, setPlans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [form] = Form.useForm();

  // Mock data for testing
  const mockPlans = [
    {
      id: 1,
      ctdt_id: 1,
      hoc_phan_id: 1,
      hoc_ky: 1,
      nam_hoc: 2023
    },
    {
      id: 2,
      ctdt_id: 1,
      hoc_phan_id: 2,
      hoc_ky: 2,
      nam_hoc: 2023
    },
    {
      id: 3,
      ctdt_id: 2,
      hoc_phan_id: 3,
      hoc_ky: 1,
      nam_hoc: 2024
    }
  ];

  // Mock data for courses
  const mockCourses = [
    { id: 1, ma_hoc_phan: 'CS101', ten_hoc_phan: 'Nhập môn lập trình', so_tin_chi: 3 },
    { id: 2, ma_hoc_phan: 'CS201', ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật', so_tin_chi: 4 },
    { id: 3, ma_hoc_phan: 'CS301', ten_hoc_phan: 'Cơ sở dữ liệu', so_tin_chi: 4 },
    { id: 4, ma_hoc_phan: 'MA101', ten_hoc_phan: 'Đại số tuyến tính', so_tin_chi: 3 }
  ];

  // Mock data for curriculums
  const mockCurriculums = [
    { id: 1, ma_ctdt: 'CTDT-CNTT', ten_ctdt: 'Công nghệ thông tin' },
    { id: 2, ma_ctdt: 'CTDT-KTPM', ten_ctdt: 'Kỹ thuật phần mềm' },
    { id: 3, ma_ctdt: 'CTDT-HTTT', ten_ctdt: 'Hệ thống thông tin' }
  ];

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real application, these would be API calls
      // const plansResponse = await axios.get('/api/ke-hoach-day-hoc');
      // const coursesResponse = await axios.get('/api/hoc-phan');
      // const curriculumsResponse = await axios.get('/api/ctdt');
      
      // setPlans(plansResponse.data);
      // setCourses(coursesResponse.data);
      // setCurriculums(curriculumsResponse.data);

      // Using mock data for now
      setPlans(mockPlans);
      setCourses(mockCourses);
      setCurriculums(mockCurriculums);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      setPlans(mockPlans);
      setCourses(mockCourses);
      setCurriculums(mockCurriculums);
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

  // Handle semester filter change
  const handleSemesterChange = (value) => {
    setSemesterFilter(value);
  };

  // Handle year filter change
  const handleYearChange = (value) => {
    setYearFilter(value);
  };

  // Filter data based on search and filters
  const filteredData = () => {
    let result = plans.map(plan => {
      const course = courses.find(c => c.id === plan.hoc_phan_id) || {};
      const curriculum = curriculums.find(c => c.id === plan.ctdt_id) || {};
      return {
        ...plan,
        ma_hoc_phan: course.ma_hoc_phan,
        ten_hoc_phan: course.ten_hoc_phan,
        so_tin_chi: course.so_tin_chi,
        ma_ctdt: curriculum.ma_ctdt,
        ten_ctdt: curriculum.ten_ctdt
      };
    });

    // Filter by search text
    if (searchText) {
      result = result.filter(plan => 
        (plan.ma_hoc_phan && plan.ma_hoc_phan.toLowerCase().includes(searchText.toLowerCase())) ||
        (plan.ten_hoc_phan && plan.ten_hoc_phan.toLowerCase().includes(searchText.toLowerCase())) ||
        (plan.ma_ctdt && plan.ma_ctdt.toLowerCase().includes(searchText.toLowerCase())) ||
        (plan.ten_ctdt && plan.ten_ctdt.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Filter by semester
    if (semesterFilter !== 'all') {
      result = result.filter(plan => plan.hoc_ky === parseInt(semesterFilter));
    }

    // Filter by year
    if (yearFilter !== 'all') {
      result = result.filter(plan => plan.nam_hoc === parseInt(yearFilter));
    }

    return result;
  };

  // Handle editing a teaching plan
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ctdt_id: record.ctdt_id,
      hoc_phan_id: record.hoc_phan_id,
      hoc_ky: record.hoc_ky,
      nam_hoc: record.nam_hoc
    });
    setIsModalVisible(true);
  };

  // Handle deleting a teaching plan
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa kế hoạch dạy học này?',
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.delete(`/api/ke-hoach-day-hoc/${id}`);
          
          const updatedPlans = plans.filter(plan => plan.id !== id);
          setPlans(updatedPlans);
          
          Modal.success({
            content: 'Xóa kế hoạch dạy học thành công'
          });
        } catch (error) {
          console.error('Error deleting teaching plan:', error);
          Modal.error({
            content: 'Có lỗi xảy ra khi xóa kế hoạch dạy học'
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
      const planData = {
        ctdt_id: values.ctdt_id,
        hoc_phan_id: values.hoc_phan_id,
        hoc_ky: values.hoc_ky,
        nam_hoc: values.nam_hoc
      };

      if (editingId) {
        // Update existing plan
        // In a real application, this would be an API call
        // await axios.put(`/api/ke-hoach-day-hoc/${editingId}`, planData);
        
        const updatedPlans = plans.map(plan => {
          if (plan.id === editingId) {
            return { ...plan, ...planData };
          }
          return plan;
        });
        
        setPlans(updatedPlans);
        Modal.success({
          content: 'Cập nhật kế hoạch dạy học thành công'
        });
      } else {
        // Create new plan
        // In a real application, this would be an API call
        // const response = await axios.post('/api/ke-hoach-day-hoc', planData);
        // const newPlan = response.data;
        
        const newPlan = {
          id: Math.max(...plans.map(p => p.id), 0) + 1,
          ...planData
        };
        
        setPlans([...plans, newPlan]);
        Modal.success({
          content: 'Thêm kế hoạch dạy học mới thành công'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        content: 'Có lỗi xảy ra khi lưu kế hoạch dạy học'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from plans data
  const getYears = () => {
    const years = [...new Set(plans.map(plan => plan.nam_hoc))];
    return years.sort((a, b) => b - a); // Sort descending
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Chương trình đào tạo',
      key: 'ctdt',
      render: (text, record) => (
        <Tooltip title={record.ten_ctdt || ''}>
          <span>{record.ma_ctdt || `ID: ${record.ctdt_id}`}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Học phần',
      key: 'hoc_phan',
      render: (text, record) => (
        <Tooltip title={`${record.ten_hoc_phan || ''} (${record.so_tin_chi || ''}TC)`}>
          <span>{record.ma_hoc_phan || `ID: ${record.hoc_phan_id}`} - {record.ten_hoc_phan || ''}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Học kỳ',
      dataIndex: 'hoc_ky',
      key: 'hoc_ky',
      width: 100,
      render: (hocKy) => {
        let color = 'blue';
        if (hocKy === 1) {
          color = 'green';
        } else if (hocKy === 2) {
          color = 'orange';
        } else if (hocKy === 3) {
          color = 'purple';
        }
        return <Tag color={color}>Học kỳ {hocKy}</Tag>;
      },
      filters: [
        { text: 'Học kỳ 1', value: 1 },
        { text: 'Học kỳ 2', value: 2 },
        { text: 'Học kỳ 3', value: 3 },
      ],
      onFilter: (value, record) => record.hoc_ky === value,
      sorter: (a, b) => a.hoc_ky - b.hoc_ky,
    },
    {
      title: 'Năm học',
      dataIndex: 'nam_hoc',
      key: 'nam_hoc',
      width: 100,
      render: (namHoc) => `${namHoc}-${namHoc + 1}`,
      sorter: (a, b) => a.nam_hoc - b.nam_hoc,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<InfoCircleOutlined />}
              onClick={() => {
                const course = courses.find(c => c.id === record.hoc_phan_id) || {};
                const curriculum = curriculums.find(c => c.id === record.ctdt_id) || {};
                
                Modal.info({
                  title: 'Chi tiết kế hoạch dạy học',
                  width: 500,
                  content: (
                    <div style={{ marginTop: 16 }}>
                      <p><strong>Mã kế hoạch:</strong> {record.id}</p>
                      <Divider style={{ margin: '8px 0' }} />
                      <p><strong>Chương trình đào tạo:</strong> {curriculum.ten_ctdt || 'N/A'} ({curriculum.ma_ctdt || 'N/A'})</p>
                      <p><strong>Học phần:</strong> {course.ten_hoc_phan || 'N/A'} ({course.ma_hoc_phan || 'N/A'})</p>
                      <p><strong>Số tín chỉ:</strong> {course.so_tin_chi || 'N/A'}</p>
                      <p><strong>Học kỳ:</strong> {record.hoc_ky}</p>
                      <p><strong>Năm học:</strong> {record.nam_hoc}-{record.nam_hoc + 1}</p>
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
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
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Kế hoạch dạy học</Title>
        <Space>
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            allowClear
            onChange={handleSearch}
          />
          <Select 
            placeholder="Học kỳ" 
            style={{ width: 120 }} 
            value={semesterFilter}
            onChange={handleSemesterChange}
          >
            <Option value="all">Tất cả HK</Option>
            <Option value="1">Học kỳ 1</Option>
            <Option value="2">Học kỳ 2</Option>
            <Option value="3">Học kỳ 3</Option>
          </Select>
          <Select 
            placeholder="Năm học" 
            style={{ width: 140 }} 
            value={yearFilter}
            onChange={handleYearChange}
          >
            <Option value="all">Tất cả năm</Option>
            {getYears().map(year => (
              <Option key={year} value={year.toString()}>
                {`${year}-${year + 1}`}
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
            Thêm kế hoạch
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
        dataSource={filteredData()} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1100 }}
      />

      {/* Modal thêm/sửa kế hoạch dạy học */}
      <Modal
        title={editingId ? "Cập nhật kế hoạch dạy học" : "Thêm kế hoạch dạy học mới"}
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
                  {curriculum.ma_ctdt} - {curriculum.ten_ctdt}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="hoc_phan_id"
            label="Học phần"
            rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}
          >
            <Select 
              placeholder="Chọn học phần"
              showSearch
              optionFilterProp="children"
            >
              {courses.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.ma_hoc_phan} - {course.ten_hoc_phan} ({course.so_tin_chi} TC)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="hoc_ky"
              label="Học kỳ"
              rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
              style={{ width: '50%' }}
            >
              <Select placeholder="Chọn học kỳ">
                <Option value={1}>Học kỳ 1</Option>
                <Option value={2}>Học kỳ 2</Option>
                <Option value={3}>Học kỳ 3</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="nam_hoc"
              label="Năm học bắt đầu"
              rules={[{ required: true, message: 'Vui lòng nhập năm học!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={2000} 
                max={2100}
                placeholder="Ví dụ: 2023"
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: '12px 0' }} />

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

export default ManageTeachingPlan; 