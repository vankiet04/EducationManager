import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Upload, 
  Tag, Tooltip, Tabs, Divider, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, UploadOutlined, FileTextOutlined,
  CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ManageSyllabuses = () => {
  const [syllabuses, setSyllabuses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('1');
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // Mock data for courses
  const mockCourses = [
    { id: 1, maHocPhan: 'CS101', tenHocPhan: 'Nhập môn lập trình', soTinChi: 3, khoaPhuTrach: 'Công nghệ thông tin' },
    { id: 2, maHocPhan: 'CS201', tenHocPhan: 'Cấu trúc dữ liệu và giải thuật', soTinChi: 4, khoaPhuTrach: 'Công nghệ thông tin' },
    { id: 3, maHocPhan: 'CS301', tenHocPhan: 'Cơ sở dữ liệu', soTinChi: 4, khoaPhuTrach: 'Công nghệ thông tin' },
    { id: 4, maHocPhan: 'MA101', tenHocPhan: 'Đại số tuyến tính', soTinChi: 3, khoaPhuTrach: 'Toán - Tin học' },
  ];

  // Mock data for syllabuses matching the DTO structure
  const mockSyllabuses = [
    {
      id: 1,
      hocPhanId: 1,
      mucTieu: 'Cung cấp kiến thức cơ bản về lập trình, thuật toán và cấu trúc dữ liệu',
      noiDung: 'Giới thiệu về lập trình, cấu trúc điều khiển, hàm, mảng, con trỏ',
      phuongPhapGiangDay: 'Thuyết giảng, thực hành, bài tập nhóm',
      phuongPhapDanhGia: 'Kiểm tra giữa kỳ 30%, Bài tập 20%, Thi cuối kỳ 50%',
      taiLieuThamKhao: 'Introduction to Programming using Python - Y. Daniel Liang',
      trangThai: 1 // Đã phê duyệt
    },
    {
      id: 2,
      hocPhanId: 2,
      mucTieu: 'Giúp sinh viên nắm vững các cấu trúc dữ liệu cơ bản và nâng cao',
      noiDung: 'Danh sách liên kết, ngăn xếp, hàng đợi, cây, đồ thị, và các giải thuật sắp xếp, tìm kiếm',
      phuongPhapGiangDay: 'Thuyết giảng, thực hành, seminar',
      phuongPhapDanhGia: 'Bài tập 30%, Đồ án 20%, Thi cuối kỳ 50%',
      taiLieuThamKhao: 'Introduction to Algorithms - Thomas H. Cormen',
      trangThai: 0 // Chờ phê duyệt
    },
    {
      id: 3,
      hocPhanId: 3,
      mucTieu: 'Cung cấp kiến thức về thiết kế, xây dựng và quản lý cơ sở dữ liệu',
      noiDung: 'Mô hình ER, chuẩn hóa, SQL, quản lý giao tác',
      phuongPhapGiangDay: 'Thuyết giảng, bài tập thực hành, đồ án môn học',
      phuongPhapDanhGia: 'Kiểm tra giữa kỳ 30%, Đồ án 20%, Thi cuối kỳ 50%',
      taiLieuThamKhao: 'Database System Concepts - Abraham Silberschatz',
      trangThai: 1 // Đã phê duyệt
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
      // const coursesResponse = await axios.get('/api/hoc-phan');
      // const syllabusesResponse = await axios.get('/api/de-cuong-chi-tiet');
      
      // setCourses(coursesResponse.data);
      // setSyllabuses(syllabusesResponse.data);
      
      // Using mock data for now
      setCourses(mockCourses);
      setSyllabuses(mockSyllabuses);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      
      // Fallback to mock data
      setCourses(mockCourses);
      setSyllabuses(mockSyllabuses);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Handle status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  // Handle edit syllabus
  const handleEdit = (record) => {
    setEditingId(record.id);
    
    // Set form values based on the record
    form.setFieldsValue({
      hocPhanId: record.hocPhanId,
      mucTieu: record.mucTieu,
      noiDung: record.noiDung,
      phuongPhapGiangDay: record.phuongPhapGiangDay,
      phuongPhapDanhGia: record.phuongPhapDanhGia,
      taiLieuThamKhao: record.taiLieuThamKhao,
      trangThai: record.trangThai
    });
    
    setIsModalVisible(true);
  };

  // Handle delete syllabus
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề cương chi tiết này?',
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.delete(`/api/de-cuong-chi-tiet/${id}`);
          
          const updatedSyllabuses = syllabuses.filter(syllabus => syllabus.id !== id);
          setSyllabuses(updatedSyllabuses);
          
          message.success('Xóa đề cương thành công');
        } catch (error) {
          console.error('Error deleting syllabus:', error);
          message.error('Có lỗi xảy ra khi xóa đề cương');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle approve syllabus
  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Xác nhận phê duyệt',
      content: 'Bạn có chắc chắn muốn phê duyệt đề cương chi tiết này?',
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.put(`/api/de-cuong-chi-tiet/${id}/approve`);
          
          const updatedSyllabuses = syllabuses.map(syllabus => {
            if (syllabus.id === id) {
              return { ...syllabus, trangThai: 1 };
            }
            return syllabus;
          });
          
          setSyllabuses(updatedSyllabuses);
          message.success('Phê duyệt đề cương thành công');
        } catch (error) {
          console.error('Error approving syllabus:', error);
          message.error('Có lỗi xảy ra khi phê duyệt đề cương');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handle reject syllabus
  const handleReject = (id) => {
    Modal.confirm({
      title: 'Xác nhận từ chối',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn từ chối phê duyệt đề cương này?</p>
          <TextArea rows={3} placeholder="Nhập lý do từ chối" />
        </div>
      ),
      onOk: async () => {
        setLoading(true);
        try {
          // In a real application, this would be an API call
          // await axios.put(`/api/de-cuong-chi-tiet/${id}/reject`);
          
          const updatedSyllabuses = syllabuses.map(syllabus => {
            if (syllabus.id === id) {
              return { ...syllabus, trangThai: 2 }; // 2 for rejected
            }
            return syllabus;
          });
          
          setSyllabuses(updatedSyllabuses);
          message.success('Đã từ chối phê duyệt đề cương');
        } catch (error) {
          console.error('Error rejecting syllabus:', error);
          message.error('Có lỗi xảy ra khi từ chối phê duyệt đề cương');
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
      if (editingId) {
        // Update existing syllabus
        // In a real application, this would be an API call
        // await axios.put(`/api/de-cuong-chi-tiet/${editingId}`, values);
        
        const updatedSyllabuses = syllabuses.map(syllabus => {
          if (syllabus.id === editingId) {
            return { ...syllabus, ...values, trangThai: 0 }; // Reset to pending approval
          }
          return syllabus;
        });
        
        setSyllabuses(updatedSyllabuses);
        message.success('Cập nhật đề cương thành công, đang chờ phê duyệt');
      } else {
        // Create new syllabus
        // In a real application, this would be an API call
        // const response = await axios.post('/api/de-cuong-chi-tiet', values);
        // const newSyllabus = response.data;
        
        const newSyllabus = {
          id: Math.max(...syllabuses.map(s => s.id), 0) + 1,
          ...values,
          trangThai: 0 // Set to pending approval (0)
        };
        
        setSyllabuses([...syllabuses, newSyllabus]);
        message.success('Thêm đề cương mới thành công, đang chờ phê duyệt');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi lưu đề cương');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search and filters
  const filterData = () => {
    // First, enrich syllabuses with course data
    const enrichedData = syllabuses.map(syllabus => {
      const course = courses.find(c => c.id === syllabus.hocPhanId) || {};
      return {
        ...syllabus,
        maHocPhan: course.maHocPhan,
        tenHocPhan: course.tenHocPhan,
        soTinChi: course.soTinChi
      };
    });
    
    let filteredData = [...enrichedData];
    
    // Filter by search text
    if (searchText) {
      filteredData = filteredData.filter(item => 
        (item.maHocPhan && item.maHocPhan.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.tenHocPhan && item.tenHocPhan.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.mucTieu && item.mucTieu.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      const statusValue = parseInt(statusFilter);
      filteredData = filteredData.filter(item => item.trangThai === statusValue);
    }
    
    return filteredData;
  };

  // Get status tag for display
  const getStatusTag = (status) => {
    let color = 'default';
    let text = 'Không xác định';
    
    switch(status) {
      case 0:
        color = 'gold';
        text = 'Chờ phê duyệt';
        break;
      case 1:
        color = 'green';
        text = 'Đã phê duyệt';
        break;
      case 2:
        color = 'red';
        text = 'Bị từ chối';
        break;
      default:
        break;
    }
    
    return <Tag color={color}>{text}</Tag>;
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
      title: 'Mã học phần',
      dataIndex: 'maHocPhan',
      key: 'maHocPhan',
      width: 120,
      sorter: (a, b) => a.maHocPhan?.localeCompare(b.maHocPhan),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Tên học phần',
      dataIndex: 'tenHocPhan',
      key: 'tenHocPhan',
      width: 200,
      sorter: (a, b) => a.tenHocPhan?.localeCompare(b.tenHocPhan),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'mucTieu',
      key: 'mucTieu',
      width: 250,
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
      title: 'Phương pháp giảng dạy',
      dataIndex: 'phuongPhapGiangDay',
      key: 'phuongPhapGiangDay',
      width: 200,
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
      width: 130,
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Đã phê duyệt', value: 1 },
        { text: 'Chờ phê duyệt', value: 0 },
        { text: 'Bị từ chối', value: 2 },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      fixed: null,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<InfoCircleOutlined />} 
              size="small"
              onClick={() => {
                const course = courses.find(c => c.id === record.hocPhanId) || {};
                Modal.info({
                  title: `Chi tiết đề cương: ${course.tenHocPhan || ''} (${course.maHocPhan || ''})`,
                  width: 700,
                  content: (
                    <div style={{ marginTop: 16 }}>
                      <Paragraph>
                        <Text strong>Mã học phần:</Text> {course.maHocPhan}
                      </Paragraph>
                      <Paragraph>
                        <Text strong>Tên học phần:</Text> {course.tenHocPhan}
                      </Paragraph>
                      
                      <Divider />
                      
                      <Paragraph>
                        <Text strong>Mục tiêu:</Text> {record.mucTieu}
                      </Paragraph>
                      
                      <Paragraph>
                        <Text strong>Nội dung:</Text> {record.noiDung}
                      </Paragraph>
                      
                      <Paragraph>
                        <Text strong>Phương pháp giảng dạy:</Text> {record.phuongPhapGiangDay}
                      </Paragraph>
                      
                      <Paragraph>
                        <Text strong>Phương pháp đánh giá:</Text> {record.phuongPhapDanhGia}
                      </Paragraph>
                      
                      <Paragraph>
                        <Text strong>Tài liệu tham khảo:</Text> {record.taiLieuThamKhao}
                      </Paragraph>
                      
                      <Paragraph>
                        <Text strong>Trạng thái:</Text> {getStatusTag(record.trangThai)}
                      </Paragraph>
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            size="small"
            disabled={record.trangThai === 1} // Disable edit if approved
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
          {record.trangThai === 0 && ( // Show approve/reject buttons only for pending items
            <>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#52c41a' }}
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button 
                danger
                icon={<CloseCircleOutlined />}
                size="small"
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý đề cương chi tiết</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={handleStatusFilter}
          >
            <Option value="all">Tất cả</Option>
            <Option value="1">Đã phê duyệt</Option>
            <Option value="0">Chờ phê duyệt</Option>
            <Option value="2">Bị từ chối</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setFileList([]);
              setIsModalVisible(true);
            }}
          >
            Thêm đề cương
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filterData()}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1300 }}
        />
      </div>

      <style>{`
        .table-container {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .action-column {
          white-space: nowrap;
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
        title={editingId ? "Cập nhật đề cương chi tiết" : "Thêm đề cương chi tiết mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Tabs activeKey={currentTab} onChange={handleTabChange}>
            <TabPane tab="Thông tin cơ bản" key="1">
              <Form.Item
                name="hocPhanId"
                label="Học phần"
                rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}
              >
                <Select 
                  placeholder="Chọn học phần"
                  showSearch
                  optionFilterProp="children"
                  disabled={!!editingId}
                >
                  {courses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.maHocPhan} - {course.tenHocPhan}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="mucTieu"
                label="Mục tiêu học phần"
                rules={[{ required: true, message: 'Vui lòng nhập mục tiêu học phần!' }]}
              >
                <TextArea rows={3} placeholder="Nhập mục tiêu của học phần" />
              </Form.Item>

              <Form.Item
                name="noiDung"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung học phần!' }]}
              >
                <TextArea rows={3} placeholder="Nhập nội dung chi tiết của học phần" />
              </Form.Item>
            </TabPane>

            <TabPane tab="Phương pháp & Đánh giá" key="2">
              <Form.Item
                name="phuongPhapGiangDay"
                label="Phương pháp giảng dạy"
                rules={[{ required: true, message: 'Vui lòng nhập phương pháp giảng dạy!' }]}
              >
                <TextArea rows={3} placeholder="Nhập phương pháp giảng dạy của học phần" />
              </Form.Item>

              <Form.Item
                name="phuongPhapDanhGia"
                label="Phương pháp đánh giá"
                rules={[{ required: true, message: 'Vui lòng nhập phương pháp đánh giá!' }]}
              >
                <TextArea rows={3} placeholder="Nhập phương pháp đánh giá của học phần" />
              </Form.Item>

              <Form.Item
                name="taiLieuThamKhao"
                label="Tài liệu tham khảo"
                rules={[{ required: true, message: 'Vui lòng nhập tài liệu tham khảo!' }]}
              >
                <TextArea rows={3} placeholder="Nhập danh sách tài liệu tham khảo" />
              </Form.Item>

              {/* Hidden field for status */}
              <Form.Item
                name="trangThai"
                hidden
                initialValue={0} // Default: pending approval
              >
                <Input />
              </Form.Item>
            </TabPane>

            <TabPane tab="File đính kèm" key="3">
              <Form.Item
                label="File đề cương chi tiết (PDF)"
              >
                <Upload
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={(file) => {
                    const isPDF = file.type === 'application/pdf';
                    if (!isPDF) {
                      message.error('Chỉ cho phép tải lên file PDF!');
                    }
                    return isPDF || Upload.LIST_IGNORE;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải lên file PDF</Button>
                </Upload>
              </Form.Item>
              <p>Lưu ý: File đề cương phải được định dạng PDF và có dung lượng tối đa 10MB.</p>
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setFileList([]);
                }}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<FileTextOutlined />}
              >
                {editingId ? 'Cập nhật đề cương' : 'Thêm đề cương'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageSyllabuses; 