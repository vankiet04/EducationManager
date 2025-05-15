import { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tooltip, Progress, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, PercentageOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const API_URL = 'http://localhost:8080/api';
// Đặt ID đề cương mặc định
const DEFAULT_DECUONG_ID = 1;

// Định nghĩa CSS
const tableStyles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: '16px'
  },
  actionColumn: {
    whiteSpace: 'nowrap',
    boxShadow: 'none !important',
    background: 'transparent !important'
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '6px'
  }
};

const ManageGradeColumns = () => {
  const [gradeColumns, setGradeColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API để lấy dữ liệu cột điểm
      const response = await axios.get(`${API_URL}/cotdiem`);
      setGradeColumns(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      message.error('Không thể tải dữ liệu cột điểm. Vui lòng thử lại sau!');
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc dữ liệu
  const filteredData = () => {
    let result = [...gradeColumns];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(item => 
        item.tenCotDiem.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    return result;
  };

  // Xử lý chỉnh sửa cột điểm
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      tenCotDiem: record.tenCotDiem,
      tyLePhanTram: parseFloat(record.tyLePhanTram),
      hinhThuc: record.hinhThuc
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa cột điểm
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa cột điểm này?',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${API_URL}/cotdiem/${id}`);
          
          // Cập nhật state sau khi xóa thành công
          const updatedColumns = gradeColumns.filter(column => column.id !== id);
          setGradeColumns(updatedColumns);
          
          message.success('Xóa cột điểm thành công');
          setLoading(false);
        } catch (error) {
          console.error('Lỗi khi xóa cột điểm:', error);
          message.error('Không thể xóa cột điểm. Vui lòng thử lại sau!');
          setLoading(false);
        }
      }
    });
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const columnData = {
        id: editingId || null,
        decuongId: DEFAULT_DECUONG_ID, // Sử dụng ID đề cương mặc định
        tenCotDiem: values.tenCotDiem,
        tyLePhanTram: values.tyLePhanTram,
        hinhThuc: values.hinhThuc
      };
      
      let response;
      if (editingId) {
        // Cập nhật cột điểm
        response = await axios.put(`${API_URL}/cotdiem/${editingId}`, columnData);
        
        // Cập nhật state sau khi sửa thành công
        const updatedColumns = gradeColumns.map(column => {
          if (column.id === editingId) {
            return response.data;
          }
          return column;
        });
        
        setGradeColumns(updatedColumns);
        message.success('Cập nhật cột điểm thành công');
      } else {
        // Kiểm tra mã cột điểm đã tồn tại chưa
        const existingCode = gradeColumns.some(
          column => column.tenCotDiem === values.tenCotDiem && 
                  column.decuongId === DEFAULT_DECUONG_ID
        );
        
        if (existingCode) {
          Modal.error({
            content: 'Tên cột điểm đã tồn tại!'
          });
          setLoading(false);
          return;
        }
        
        // Thêm cột điểm mới
        response = await axios.post(`${API_URL}/cotdiem`, columnData);
        
        // Cập nhật state sau khi thêm thành công
        setGradeColumns([...gradeColumns, response.data]);
        message.success('Thêm cột điểm mới thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lưu cột điểm:', error);
      message.error('Không thể lưu cột điểm. Vui lòng thử lại sau!');
      setLoading(false);
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
      title: 'Tên cột điểm',
      dataIndex: 'tenCotDiem',
      key: 'tenCotDiem',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.tenCotDiem.localeCompare(b.tenCotDiem),
    },
    {
      title: 'Tỷ lệ (%)',
      dataIndex: 'tyLePhanTram',
      key: 'tyLePhanTram',
      width: 120,
      render: (text) => {
        const percentage = parseFloat(text);
        return (
          <Tooltip title={`${percentage}%`}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60px', marginRight: '8px' }}>
                <Progress 
                  percent={percentage} 
                  showInfo={false} 
                  size="small" 
                  status="normal"
                />
              </div>
              <span>{percentage}%</span>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => parseFloat(a.tyLePhanTram) - parseFloat(b.tyLePhanTram),
    },
    {
      title: 'Hình thức',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.hinhThuc.localeCompare(b.hinhThuc),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" style={tableStyles.actionButtons}>
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                tyLePhanTram: 0
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

      <div style={tableStyles.container}>
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
            name="tenCotDiem"
            label="Tên cột điểm"
            rules={[{ required: true, message: 'Vui lòng nhập tên cột điểm!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tyLePhanTram"
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
            name="hinhThuc"
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