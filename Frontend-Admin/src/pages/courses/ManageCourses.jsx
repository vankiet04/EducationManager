import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Mô phỏng dữ liệu học phần
  const mockData = [
    {
      id: 1,
      ma_hoc_phan: 'CS101',
      ten_hoc_phan: 'Nhập môn lập trình',
      so_tin_chi: 3,
      so_tiet_ly_thuyet: 30,
      so_tiet_thuc_hanh: 30,
      khoa_phu_trach: 'Công nghệ thông tin',
      he_dao_tao: 'Đại học',
      mo_ta: 'Học phần cung cấp kiến thức cơ bản về ngôn ngữ lập trình, thuật toán và cấu trúc dữ liệu.',
      trang_thai: 1
    },
    {
      id: 2,
      ma_hoc_phan: 'CS201',
      ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật',
      so_tin_chi: 4,
      so_tiet_ly_thuyet: 45,
      so_tiet_thuc_hanh: 30,
      khoa_phu_trach: 'Công nghệ thông tin',
      he_dao_tao: 'Đại học',
      mo_ta: 'Học phần nâng cao về các cấu trúc dữ liệu và thuật toán phổ biến.',
      trang_thai: 1
    },
    {
      id: 3,
      ma_hoc_phan: 'CS301',
      ten_hoc_phan: 'Cơ sở dữ liệu',
      so_tin_chi: 4,
      so_tiet_ly_thuyet: 45,
      so_tiet_thuc_hanh: 30,
      khoa_phu_trach: 'Công nghệ thông tin',
      he_dao_tao: 'Đại học',
      mo_ta: 'Học phần cung cấp kiến thức về thiết kế, xây dựng và quản lý cơ sở dữ liệu.',
      trang_thai: 1
    },
    {
      id: 4,
      ma_hoc_phan: 'MA101',
      ten_hoc_phan: 'Đại số tuyến tính',
      so_tin_chi: 3,
      so_tiet_ly_thuyet: 45,
      so_tiet_thuc_hanh: 0,
      khoa_phu_trach: 'Toán - Tin học',
      he_dao_tao: 'Đại học',
      mo_ta: 'Học phần cung cấp kiến thức cơ bản về đại số tuyến tính.',
      trang_thai: 0
    }
  ];

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Hàm lấy dữ liệu học phần
  const fetchCourses = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setCourses(mockData);
      setLoading(false);
    }, 500);
  };

  // Xử lý sự kiện khi người dùng nhấn nút chỉnh sửa
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ma_hoc_phan: record.ma_hoc_phan,
      ten_hoc_phan: record.ten_hoc_phan,
      so_tin_chi: record.so_tin_chi,
      so_tiet_ly_thuyet: record.so_tiet_ly_thuyet,
      so_tiet_thuc_hanh: record.so_tiet_thuc_hanh,
      khoa_phu_trach: record.khoa_phu_trach,
      he_dao_tao: record.he_dao_tao,
      mo_ta: record.mo_ta,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Xử lý sự kiện khi người dùng xác nhận xóa
  const handleDelete = (courseId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa học phần này?',
      onOk: () => {
        setLoading(true);
        // Mô phỏng API call
        setTimeout(() => {
          const updatedCourses = courses.filter(course => course.id !== courseId);
          setCourses(updatedCourses);
          Modal.success({
            content: 'Xóa học phần thành công'
          });
          setLoading(false);
        }, 500);
      }
    });
  };

  // Xử lý sự kiện khi người dùng toggle trạng thái
  const handleToggleStatus = (record) => {
    const newStatus = record.trang_thai === 1 ? 0 : 1;
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      const updatedCourses = courses.map(course => {
        if (course.id === record.id) {
          return { ...course, trang_thai: newStatus };
        }
        return course;
      });
      setCourses(updatedCourses);
      Modal.success({
        content: `Học phần đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
      });
      setLoading(false);
    }, 500);
  };

  // Xử lý sự kiện khi người dùng submit form thêm/sửa
  const handleSubmit = (values) => {
    setLoading(true);
    
    if (editingId) {
      // Mô phỏng API cập nhật
      setTimeout(() => {
        const updatedCourses = courses.map(course => {
          if (course.id === editingId) {
            return { ...course, ...values };
          }
          return course;
        });
        setCourses(updatedCourses);
        setIsModalVisible(false);
        Modal.success({
          content: 'Cập nhật học phần thành công'
        });
        setLoading(false);
      }, 500);
    } else {
      // Mô phỏng API thêm mới
      setTimeout(() => {
        const newCourse = {
          id: Math.max(...courses.map(c => c.id), 0) + 1,
          ...values
        };
        setCourses([...courses, newCourse]);
        setIsModalVisible(false);
        Modal.success({
          content: 'Thêm học phần mới thành công'
        });
        setLoading(false);
      }, 500);
    }
  };

  // Xử lý sự kiện khi người dùng tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = searchText
    ? courses.filter(course => 
        course.ma_hoc_phan.toLowerCase().includes(searchText.toLowerCase()) ||
        course.ten_hoc_phan.toLowerCase().includes(searchText.toLowerCase()) ||
        course.khoa_phu_trach.toLowerCase().includes(searchText.toLowerCase())
      )
    : courses;

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
      title: 'Mã học phần',
      dataIndex: 'ma_hoc_phan',
      key: 'ma_hoc_phan',
      width: 120,
      sorter: (a, b) => a.ma_hoc_phan.localeCompare(b.ma_hoc_phan),
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
      title: 'Tên học phần',
      dataIndex: 'ten_hoc_phan',
      key: 'ten_hoc_phan',
      width: 200,
      sorter: (a, b) => a.ten_hoc_phan.localeCompare(b.ten_hoc_phan),
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
      title: 'Số tín chỉ',
      dataIndex: 'so_tin_chi',
      key: 'so_tin_chi',
      width: 100,
      sorter: (a, b) => a.so_tin_chi - b.so_tin_chi,
    },
    {
      title: 'Số tiết',
      key: 'so_tiet',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (_, record) => (
        <Tooltip placement="topLeft" title={`LT: ${record.so_tiet_ly_thuyet}, TH: ${record.so_tiet_thuc_hanh}`}>
          <span>
            LT: {record.so_tiet_ly_thuyet}, TH: {record.so_tiet_thuc_hanh}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Khoa phụ trách',
      dataIndex: 'khoa_phu_trach',
      key: 'khoa_phu_trach',
      width: 150,
      filters: [...new Set(courses.map(course => course.khoa_phu_trach))].map(khoa => ({
        text: khoa,
        value: khoa,
      })),
      onFilter: (value, record) => record.khoa_phu_trach === value,
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
      title: 'Hệ đào tạo',
      dataIndex: 'he_dao_tao',
      key: 'he_dao_tao',
      width: 120,
      filters: [
        { text: 'Đại học', value: 'Đại học' },
        { text: 'Cao đẳng', value: 'Cao đẳng' },
        { text: 'Sau đại học', value: 'Sau đại học' },
      ],
      onFilter: (value, record) => record.he_dao_tao === value,
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
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 120,
      filters: [
        { text: 'Hoạt động', value: 1 },
        { text: 'Không hoạt động', value: 0 },
      ],
      onFilter: (value, record) => record.trang_thai === value,
      render: (trang_thai) => (
        <Tag color={trang_thai === 1 ? 'green' : 'red'}>
          {trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
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
          <Button
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              Modal.info({
                title: `${record.ten_hoc_phan} (${record.ma_hoc_phan})`,
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Mã học phần:</strong> {record.ma_hoc_phan}</p>
                    <p><strong>Tên học phần:</strong> {record.ten_hoc_phan}</p>
                    <p><strong>Số tín chỉ:</strong> {record.so_tin_chi}</p>
                    <p><strong>Số tiết lý thuyết:</strong> {record.so_tiet_ly_thuyet}</p>
                    <p><strong>Số tiết thực hành:</strong> {record.so_tiet_thuc_hanh}</p>
                    <p><strong>Khoa phụ trách:</strong> {record.khoa_phu_trach}</p>
                    <p><strong>Hệ đào tạo:</strong> {record.he_dao_tao}</p>
                    <p><strong>Mô tả:</strong> {record.mo_ta}</p>
                    <p><strong>Trạng thái:</strong> {record.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
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
        <Title level={2}>Quản lý học phần</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên, khoa..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
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
                so_tin_chi: 3,
                so_tiet_ly_thuyet: 30,
                so_tiet_thuc_hanh: 15,
                he_dao_tao: 'Đại học',
                trang_thai: 1
              });
              setIsModalVisible(true);
            }}
          >
            Thêm học phần
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchCourses}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
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
      `}</style>

      <Modal
        title={editingId ? "Sửa thông tin học phần" : "Thêm học phần mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="ma_hoc_phan"
              label="Mã học phần"
              rules={[{ required: true, message: 'Vui lòng nhập mã học phần!' }]}
              style={{ width: '50%' }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="so_tin_chi"
              label="Số tín chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item
            name="ten_hoc_phan"
            label="Tên học phần"
            rules={[{ required: true, message: 'Vui lòng nhập tên học phần!' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="so_tiet_ly_thuyet"
              label="Số tiết lý thuyết"
              rules={[{ required: true, message: 'Vui lòng nhập số tiết lý thuyết!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="so_tiet_thuc_hanh"
              label="Số tiết thực hành"
              rules={[{ required: true, message: 'Vui lòng nhập số tiết thực hành!' }]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="khoa_phu_trach"
              label="Khoa phụ trách"
              rules={[{ required: true, message: 'Vui lòng nhập khoa phụ trách!' }]}
              style={{ width: '50%' }}
            >
              <Select>
                <Option value="Công nghệ thông tin">Công nghệ thông tin</Option>
                <Option value="Toán - Tin học">Toán - Tin học</Option>
                <Option value="Điện tử - Viễn thông">Điện tử - Viễn thông</Option>
                <Option value="Khoa học máy tính">Khoa học máy tính</Option>
                <Option value="Kỹ thuật phần mềm">Kỹ thuật phần mềm</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="he_dao_tao"
              label="Hệ đào tạo"
              rules={[{ required: true, message: 'Vui lòng chọn hệ đào tạo!' }]}
              style={{ width: '50%' }}
            >
              <Select>
                <Option value="Đại học">Đại học</Option>
                <Option value="Cao đẳng">Cao đẳng</Option>
                <Option value="Sau đại học">Sau đại học</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="mo_ta"
            label="Mô tả học phần"
          >
            <TextArea rows={4} />
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

export default ManageCourses; 