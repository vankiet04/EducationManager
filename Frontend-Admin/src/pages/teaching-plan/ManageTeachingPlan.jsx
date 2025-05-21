import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Select, Tag, Modal, Form, Tooltip, Divider, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

// Define API base URL
const API_URL = 'http://localhost:8080';

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
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [form] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
    // Also check the raw API data
    debugRawApiData();
  }, []);

  // Debug function to check raw API data
  const debugRawApiData = async () => {
    try {
      // Get raw data directly from endpoints
      const plansRaw = await axios.get(`${API_URL}/api/KeHoachDayHoc`);
      const coursesRaw = await axios.get(`${API_URL}/api/hocphan`);
      const curriculumsRaw = await axios.get(`${API_URL}/api/thongTinChung`);

      console.log('===== DEBUG RAW API DATA =====');
      console.log('Raw plans data:', plansRaw.data);
      if (plansRaw.data && plansRaw.data.length > 0) {
        console.log('First plan entry fields:', Object.keys(plansRaw.data[0]));
        console.log('First plan entry values:', plansRaw.data[0]);
      }
      
      console.log('Raw courses data:', coursesRaw.data);
      if (coursesRaw.data && coursesRaw.data.length > 0) {
        console.log('First course entry fields:', Object.keys(coursesRaw.data[0]));
        console.log('First course entry values:', coursesRaw.data[0]);
      }
      
      console.log('Raw curriculums data:', curriculumsRaw.data);
      if (curriculumsRaw.data && curriculumsRaw.data.length > 0) {
        console.log('First curriculum entry fields:', Object.keys(curriculumsRaw.data[0]));
        console.log('First curriculum entry values:', curriculumsRaw.data[0]);
      }
      console.log('================================');
    } catch (error) {
      console.error('Debug API error:', error);
    }
  };

  // Fetch all necessary data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get teaching plans from backend API (kehoachdayhoc)
      const plansResponse = await axios.get(`${API_URL}/api/KeHoachDayHoc`);
      
      // Get courses from backend API (hocphan)
      const coursesResponse = await axios.get(`${API_URL}/api/hocphan`);
      
      // Get curriculums from backend API (thongtinchung)
      const curriculumsResponse = await axios.get(`${API_URL}/api/thongTinChung`);
      
      console.log('Plans data:', plansResponse.data);
      console.log('Courses data:', coursesResponse.data);
      console.log('Curriculums data:', curriculumsResponse.data);
      
      // Check if data has proper structure and log first item
      if (plansResponse.data.length > 0) {
        console.log('First plan item:', plansResponse.data[0]);
      }
      if (coursesResponse.data.length > 0) {
        console.log('First course item:', coursesResponse.data[0]);
      }
      if (curriculumsResponse.data.length > 0) {
        console.log('First curriculum item:', curriculumsResponse.data[0]);
      }

      // Normalize curriculum data - try all possible field names
      const normalizedCurriculums = curriculumsResponse.data.map(curriculum => ({
        id: Number(curriculum.id),
        ma_ctdt: curriculum.ma_ctdt || curriculum.maCTDT || curriculum.maCtdt || '',
        ten_ctdt: curriculum.ten_ctdt || curriculum.tenCTDT || curriculum.tenCtdt || curriculum.name || ''
      }));

      // Normalize course data - try all possible field names
      const normalizedCourses = coursesResponse.data.map(course => ({
        id: Number(course.id),
        ma_hp: course.ma_hp || course.maHP || course.maHp || course.code || '',
        ten_hp: course.ten_hp || course.tenHP || course.tenHp || course.name || '',
        so_tin_chi: course.so_tin_chi || course.soTinChi || course.soTinchi || course.credits || 0
      }));
      
      // Normalize teaching plan data - try all possible field names
      const normalizedPlans = plansResponse.data.map(plan => ({
        id: Number(plan.id),
        ctdt_id: Number(plan.ctdt_id || plan.ctdtId || plan.ctdt || 0),
        hoc_phan_id: Number(plan.hoc_phan_id || plan.hocPhanId || plan.hocphan || 0),
        hoc_ky: Number(plan.hoc_ky || plan.hocKy || plan.hocky || 1),
        nam_hoc: Number(plan.nam_hoc || plan.namHoc || plan.namhoc || 0)
      }));
      
      console.log('Normalized plans:', normalizedPlans);
      console.log('Normalized courses:', normalizedCourses);
      console.log('Normalized curriculums:', normalizedCurriculums);
      
      // Log the structure of the first entries
      if (normalizedPlans.length > 0 && normalizedCourses.length > 0 && normalizedCurriculums.length > 0) {
        const planExample = normalizedPlans[0];
        const courseExample = normalizedCourses.find(c => c.id === planExample.hoc_phan_id);
        const curriculumExample = normalizedCurriculums.find(c => c.id === planExample.ctdt_id);
        
        console.log("==== DATA FORMAT CHECK ====");
        console.log("Example Plan:", planExample);
        console.log("Example Course match:", courseExample);
        console.log("Example Curriculum match:", curriculumExample);
        
        // Debug type comparisons
        if (courseExample) {
          console.log("Course ID types:", 
                      typeof planExample.hoc_phan_id, planExample.hoc_phan_id, 
                      typeof courseExample.id, courseExample.id);
        }
        
        if (curriculumExample) {
          console.log("Curriculum ID types:", 
                      typeof planExample.ctdt_id, planExample.ctdt_id, 
                      typeof curriculumExample.id, curriculumExample.id);
        }
        console.log("=========================");
      }
      
      setPlans(normalizedPlans);
      setCourses(normalizedCourses);
      setCurriculums(normalizedCurriculums);
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

  // Handle semester filter change
  const handleSemesterChange = (value) => {
    setSemesterFilter(value);
  };

  // Handle year filter change
  const handleYearChange = (value) => {
    // Nếu là "all" thì lưu giá trị "all", ngược lại lưu số nguyên
    setYearFilter(value);
  };

  // Handle curriculum filter change
  const handleCurriculumChange = (value) => {
    setCurriculumFilter(value);
    // Reset semester filter when curriculum changes
    setSemesterFilter('all');
  };

  // Get unique semesters for the selected curriculum
  const getUniqueSemesters = () => {
    let filteredPlans = plans;
    
    // Filter by curriculum if selected
    if (curriculumFilter !== 'all') {
      filteredPlans = filteredPlans.filter(plan => plan.ctdt_id === Number(curriculumFilter));
    }
    
    // Get unique semesters from the filtered plans
    const semesters = [...new Set(filteredPlans.map(plan => plan.hoc_ky))];
    return semesters.sort((a, b) => a - b); // Sort ascending
  };

  // Filter data based on search and filters
  const filteredData = () => {
    let result = plans;

    // Filter by curriculum
    if (curriculumFilter !== 'all') {
      result = result.filter(plan => plan.ctdt_id === Number(curriculumFilter));
    }

    // Filter by semester
    if (semesterFilter !== 'all') {
      result = result.filter(plan => plan.hoc_ky === parseInt(semesterFilter));
    }

    // Filter by year
    if (yearFilter !== 'all') {
      result = result.filter(plan => plan.nam_hoc === parseInt(yearFilter));
    }

    // Filter by search text
    if (searchText) {
      result = result.filter(plan => {
        const course = courses.find(c => c.id === plan.hoc_phan_id) || {};
        const curriculum = curriculums.find(c => c.id === plan.ctdt_id) || {};
        
        // Search in course name/code
        const courseMatch = 
          (course.ma_hp && course.ma_hp.toLowerCase().includes(searchText.toLowerCase())) ||
          (course.ten_hp && course.ten_hp.toLowerCase().includes(searchText.toLowerCase()));
        
        // Search in curriculum name/code
        const curriculumMatch = 
          (curriculum.ma_ctdt && curriculum.ma_ctdt.toLowerCase().includes(searchText.toLowerCase())) ||
          (curriculum.ten_ctdt && curriculum.ten_ctdt.toLowerCase().includes(searchText.toLowerCase()));
          
        return courseMatch || curriculumMatch;
      });
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
          await axios.delete(`${API_URL}/api/KeHoachDayHoc/${id}`);
          
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
      // Đảm bảo năm học là số nguyên
      let namHoc = values.nam_hoc;
      if (typeof namHoc === 'string' && namHoc.includes('-')) {
        // Nếu năm học là chuỗi dạng "2023-2024", lấy phần đầu và chuyển thành số
        const yearParts = namHoc.split('-');
        namHoc = parseInt(yearParts[0]);
      }

      const planData = {
        ctdt_id: values.ctdt_id,
        hoc_phan_id: values.hoc_phan_id,
        hoc_ky: values.hoc_ky,
        nam_hoc: namHoc
      };

      if (editingId) {
        // Update existing plan
        planData.id = editingId;
        await axios.put(`${API_URL}/api/KeHoachDayHoc/${editingId}`, planData);
        
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
        const response = await axios.post(`${API_URL}/api/KeHoachDayHoc`, planData);
        const newPlan = response.data;
        
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
      render: (text, record) => {
        // Try to find the curriculum by making sure IDs are compared as strings
        // This handles cases where IDs might be numbers in one place and strings in another
        const currId = record.ctdt_id;
        const curriculum = curriculums.find(c => String(c.id) === String(currId));
        
        if (!curriculum) {
          console.log(`No curriculum found for ID: ${currId}`);
          return <span>Chương trình không xác định (ID: {currId || 'N/A'})</span>;
        }
        
        // Based on thongtinchung table structure
        return (
          <Tooltip title={curriculum.ten_ctdt || ''}>
            <span>{curriculum.ma_ctdt || ''} - {curriculum.ten_ctdt || 'Chương trình không xác định'}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Học phần',
      key: 'hoc_phan',
      render: (text, record) => {
        // Try to find the course by making sure IDs are compared as strings
        // This handles cases where IDs might be numbers in one place and strings in another
        const hpId = record.hoc_phan_id;
        const course = courses.find(c => String(c.id) === String(hpId));
        
        if (!course) {
          console.log(`No course found for ID: ${hpId}`);
          return <span>Học phần không xác định (ID: {hpId || 'N/A'})</span>;
        }
        
        // Based on hocphan table structure
        return (
          <Tooltip title={`${course.ten_hp || ''} (${course.so_tin_chi || ''}TC)`}>
            <span>{course.ma_hp || ''} - {course.ten_hp || 'Học phần không xác định'}</span>
          </Tooltip>
        );
      },
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
                      <p><strong>Học phần:</strong> {course.ten_hp || 'N/A'} ({course.ma_hp || 'N/A'})</p>
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
            placeholder="Chương trình đào tạo" 
            style={{ width: 200 }} 
            value={curriculumFilter}
            onChange={handleCurriculumChange}
          >
            <Option value="all">Tất cả chương trình</Option>
            {curriculums.map(curriculum => (
              <Option key={curriculum.id} value={curriculum.id.toString()}>
                {curriculum.ma_ctdt} - {curriculum.ten_ctdt}
              </Option>
            ))}
          </Select>
          <Select 
            placeholder="Học kỳ" 
            style={{ width: 120 }} 
            value={semesterFilter}
            onChange={handleSemesterChange}
            disabled={curriculumFilter === 'all'}
          >
            <Option value="all">Tất cả HK</Option>
            {getUniqueSemesters().map(semester => (
              <Option key={semester} value={semester.toString()}>
                Học kỳ {semester}
              </Option>
            ))}
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
                  {course.ma_hp} - {course.ten_hp} ({course.so_tin_chi} TC)
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
                min={2000} 
                max={2050}
                placeholder="Ví dụ: 2023"
                style={{ width: '100%' }}
                formatter={value => {
                  if (value) {
                    return `${value}-${Number(value) + 1}`;
                  }
                  return '';
                }}
                parser={value => {
                  if (value) {
                    const parts = value.split('-');
                    if (parts.length > 0) {
                      return parseInt(parts[0], 10);
                    }
                  }
                  return '';
                }}
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