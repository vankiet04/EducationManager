import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Divider, Progress } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, PercentageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageGradeColumns = () => {
  const [gradeColumns, setGradeColumns] = useState([]);
  const [courses, setCourses] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [form] = Form.useForm();

  // Mô phỏng dữ liệu học phần
  const mockCourses = [
    { id: 1, ma_hoc_phan: 'CS101', ten_hoc_phan: 'Nhập môn lập trình', so_tin_chi: 3, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 2, ma_hoc_phan: 'CS201', ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật', so_tin_chi: 4, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 3, ma_hoc_phan: 'CS301', ten_hoc_phan: 'Cơ sở dữ liệu', so_tin_chi: 4, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 4, ma_hoc_phan: 'MA101', ten_hoc_phan: 'Đại số tuyến tính', so_tin_chi: 3, khoa_phu_trach: 'Toán - Tin học' },
  ];

  // Mô phỏng dữ liệu đề cương
  const mockSyllabuses = [
    { id: 1, hoc_phan_id: 1, phien_ban: '2023.1', trang_thai: 'Đã phê duyệt' },
    { id: 2, hoc_phan_id: 2, phien_ban: '2023.1', trang_thai: 'Đã phê duyệt' },
    { id: 3, hoc_phan_id: 3, phien_ban: '2022.2', trang_thai: 'Đã phê duyệt' },
  ];

  // Mô phỏng dữ liệu cột điểm
  const mockGradeColumns = [
    {
      id: 1,
      decuong_id: 1,
      ten_cot_diem: 'Chuyên cần',
      ty_le_phan_tram: 10,
      hinh_thuc: 'Điểm danh',
      trang_thai: 1
    },
    {
      id: 2,
      decuong_id: 1,
      ten_cot_diem: 'Giữa kỳ',
      ty_le_phan_tram: 30,
      hinh_thuc: 'Thi viết',
      trang_thai: 1
    },
    {
      id: 3,
      decuong_id: 1,
      ten_cot_diem: 'Cuối kỳ',
      ty_le_phan_tram: 60,
      hinh_thuc: 'Thi viết',
      trang_thai: 1
    },
    {
      id: 4,
      decuong_id: 2,
      ten_cot_diem: 'Chuyên cần',
      ty_le_phan_tram: 10,
      hinh_thuc: 'Điểm danh',
      trang_thai: 1
    }
  ];

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm lấy dữ liệu
  const fetchData = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setCourses(mockCourses);
      setSyllabuses(mockSyllabuses);
      setGradeColumns(mockGradeColumns);
      setLoading(false);
    }, 500);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Xử lý lọc theo học phần
  const handleCourseFilter = (value) => {
    setCourseFilter(value);
  };

  // Lọc dữ liệu
  const filteredData = () => {
    let result = [...gradeColumns];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(item => 
        item.ten_cot_diem.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Lọc theo học phần
    if (courseFilter !== 'all') {
      const courseId = parseInt(courseFilter);
      result = result.filter(item => item.decuong_id === courseId);
    }
    
    return result;
  };

  // Kiểm tra tổng tỷ lệ điểm
  const checkTotalPercentage = (courseId) => {
    const courseGradeColumns = gradeColumns.filter(item => item.decuong_id === courseId);
    const total = courseGradeColumns.reduce((sum, item) => sum + item.ty_le_phan_tram, 0);
    return total;
  };

  // Xử lý chỉnh sửa cột điểm
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      decuong_id: record.decuong_id,
      ten_cot_diem: record.ten_cot_diem,
      ty_le_phan_tram: record.ty_le_phan_tram,
      hinh_thuc: record.hinh_thuc,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa cột điểm
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cột điểm này?',
      onOk: () => {
        setLoading(true);
        // Mô phỏng API call
        setTimeout(() => {
          const updatedColumns = gradeColumns.filter(column => column.id !== id);
          setGradeColumns(updatedColumns);
          Modal.success({
            content: 'Xóa cột điểm thành công'
          });
          setLoading(false);
        }, 500);
      }
    });
  };

  // Xử lý toggle trạng thái
  const handleToggleStatus = (record) => {
    const newStatus = record.trang_thai === 1 ? 0 : 1;
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      const updatedColumns = gradeColumns.map(column => {
        if (column.id === record.id) {
          return { ...column, trang_thai: newStatus };
        }
        return column;
      });
      setGradeColumns(updatedColumns);
      Modal.success({
        content: `Cột điểm đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
      });
      setLoading(false);
    }, 500);
  };

  // Xử lý submit form
  const handleSubmit = (values) => {
    setLoading(true);
    
    // Kiểm tra tỷ lệ điểm
    const columnsWithSameSyllabus = gradeColumns.filter(col => col.decuong_id === values.decuong_id);
    const currentTotalPercentage = columnsWithSameSyllabus.reduce((sum, item) => sum + item.ty_le_phan_tram, 0);
    const existingColumn = editingId ? gradeColumns.find(column => column.id === editingId) : null;
    const existingPercentage = existingColumn ? existingColumn.ty_le_phan_tram : 0;
    const newTotalPercentage = currentTotalPercentage - existingPercentage + values.ty_le_phan_tram;
    
    if (newTotalPercentage > 100) {
      Modal.error({
        title: 'Lỗi tỷ lệ điểm',
        content: `Tổng tỷ lệ điểm vượt quá 100%. Hiện tại: ${currentTotalPercentage - existingPercentage}%, thêm mới: ${values.ty_le_phan_tram}%`
      });
      setLoading(false);
      return;
    }
    
    const columnData = {
      decuong_id: values.decuong_id,
      ten_cot_diem: values.ten_cot_diem,
      ty_le_phan_tram: values.ty_le_phan_tram,
      hinh_thuc: values.hinh_thuc,
      trang_thai: values.trang_thai
    };
    
    if (editingId) {
      // Cập nhật cột điểm
      setTimeout(() => {
        const updatedColumns = gradeColumns.map(column => {
          if (column.id === editingId) {
            return { ...column, ...columnData };
          }
          return column;
        });
        setGradeColumns(updatedColumns);
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Cập nhật cột điểm thành công'
        });
        setLoading(false);
      }, 500);
    } else {
      // Kiểm tra mã cột điểm đã tồn tại chưa
      const existingCode = gradeColumns.some(
        column => column.ten_cot_diem === values.ten_cot_diem && 
                column.decuong_id === values.decuong_id
      );
      
      if (existingCode) {
        Modal.error({
          content: 'Tên cột điểm đã tồn tại cho đề cương này!'
        });
        setLoading(false);
        return;
      }
      
      // Thêm cột điểm mới
      setTimeout(() => {
        const newColumn = {
          id: Math.max(...gradeColumns.map(column => column.id), 0) + 1,
          ...columnData
        };
        setGradeColumns([...gradeColumns, newColumn]);
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Thêm cột điểm mới thành công'
        });
        setLoading(false);
      }, 500);
    }
  };

  // Định nghĩa các cột trong bảng
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
      title: 'Đề cương',
      dataIndex: 'decuong_id',
      key: 'decuong_id',
      width: 120,
      sorter: (a, b) => a.decuong_id - b.decuong_id,
    },
    {
      title: 'Tên cột điểm',
      dataIndex: 'ten_cot_diem',
      key: 'ten_cot_diem',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.ten_cot_diem.localeCompare(b.ten_cot_diem),
    },
    {
      title: 'Tỷ lệ (%)',
      dataIndex: 'ty_le_phan_tram',
      key: 'ty_le_phan_tram',
      width: 120,
      render: (text, record) => (
        <Tooltip title={`${text}%`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '60px', marginRight: '8px' }}>
              <Progress 
                percent={text} 
                showInfo={false} 
                size="small" 
                status="normal"
              />
            </div>
            <span>{text}%</span>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.ty_le_phan_tram - b.ty_le_phan_tram,
    },
    {
      title: 'Hình thức',
      dataIndex: 'hinh_thuc',
      key: 'hinh_thuc',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.hinh_thuc.localeCompare(b.hinh_thuc),
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
            type={record.trang_thai === 1 ? 'default' : 'primary'}
            size="small"
            onClick={() => handleToggleStatus(record)}
          >
            {record.trang_thai === 1 ? 'Vô hiệu' : 'Kích hoạt'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý cột điểm</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          <Select
            placeholder="Lọc theo đề cương"
            style={{ width: 250 }}
            value={courseFilter}
            onChange={handleCourseFilter}
          >
            <Option value="all">Tất cả đề cương</Option>
            {syllabuses.map(syllabus => {
              const course = courses.find(c => c.id === syllabus.hoc_phan_id);
              return (
                <Option key={syllabus.id} value={syllabus.id.toString()}>
                  {course?.ma_hoc_phan} - Đề cương {syllabus.phien_ban}
                </Option>
              );
            })}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trang_thai: 1,
                ty_le_phan_tram: 0
              });
              setIsModalVisible(true);
            }}
          >
            Thêm mới
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </div>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredData()}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`
          }}
          size="middle"
          scroll={{ x: 900 }}
          bordered={false}
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
        .ant-table-cell {
          border-right: none !important;
        }
        .ant-table-thead > tr > th {
          border-right: none !important;
          background-color: #f5f5f5;
        }
        .ant-table-tbody > tr > td {
          border-right: none !important;
        }
      `}</style>

      <Modal
        title={editingId ? "Cập nhật cột điểm" : "Thêm cột điểm mới"}
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
            name="decuong_id"
            label="Đề cương"
            rules={[{ required: true, message: 'Vui lòng chọn đề cương!' }]}
          >
            <Select placeholder="Chọn đề cương">
              {syllabuses.map(syllabus => {
                const course = courses.find(c => c.id === syllabus.hoc_phan_id);
                return (
                  <Option key={syllabus.id} value={syllabus.id}>
                    {course?.ma_hoc_phan} - Đề cương {syllabus.phien_ban}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="ten_cot_diem"
            label="Tên cột điểm"
            rules={[{ required: true, message: 'Vui lòng nhập tên cột điểm!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ty_le_phan_tram"
            label="Tỷ lệ phần trăm"
            rules={[
              { required: true, message: 'Vui lòng nhập tỷ lệ phần trăm!' },
              { type: 'number', min: 0, max: 100, message: 'Tỷ lệ phải nằm trong khoảng 0-100%!' }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              max={100} 
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            name="hinh_thuc"
            label="Hình thức"
            rules={[{ required: true, message: 'Vui lòng nhập hình thức đánh giá!' }]}
          >
            <Select placeholder="Chọn hình thức đánh giá">
              <Option value="Điểm danh">Điểm danh</Option>
              <Option value="Thi vấn đáp">Thi vấn đáp</Option>
              <Option value="Thi viết">Thi viết</Option>
              <Option value="Bài tập lớn">Bài tập lớn</Option>
              <Option value="Thuyết trình">Thuyết trình</Option>
              <Option value="Thực hành">Thực hành</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="trang_thai"
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
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<PercentageOutlined />} 
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

export default ManageGradeColumns; 