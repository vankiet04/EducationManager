import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, Tag, 
  DatePicker, Tooltip, Badge, Collapse, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, 
  ReloadOutlined, DownOutlined, FileAddOutlined, UsergroupAddOutlined, ScheduleOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TextArea } = Input;

const ManageCourseGroups = () => {
  const [courseGroups, setCourseGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [form] = Form.useForm();

  // Mô phỏng dữ liệu học kỳ
  const mockSemesters = [
    { id: 1, ten_hoc_ky: 'Học kỳ 1 năm 2023-2024', thoi_gian_bat_dau: '2023-08-15', thoi_gian_ket_thuc: '2024-01-15' },
    { id: 2, ten_hoc_ky: 'Học kỳ 2 năm 2023-2024', thoi_gian_bat_dau: '2024-02-01', thoi_gian_ket_thuc: '2024-06-30' },
    { id: 3, ten_hoc_ky: 'Học kỳ hè năm 2024', thoi_gian_bat_dau: '2024-07-01', thoi_gian_ket_thuc: '2024-08-15' },
  ];

  // Mô phỏng dữ liệu học phần
  const mockCourses = [
    { id: 1, ma_hoc_phan: 'CS101', ten_hoc_phan: 'Nhập môn lập trình', so_tin_chi: 3, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 2, ma_hoc_phan: 'CS201', ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật', so_tin_chi: 4, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 3, ma_hoc_phan: 'CS301', ten_hoc_phan: 'Cơ sở dữ liệu', so_tin_chi: 4, khoa_phu_trach: 'Công nghệ thông tin' },
    { id: 4, ma_hoc_phan: 'MA101', ten_hoc_phan: 'Đại số tuyến tính', so_tin_chi: 3, khoa_phu_trach: 'Toán - Tin học' },
  ];

  // Mô phỏng dữ liệu giảng viên
  const mockLecturers = [
    { id: 1, ma_gv: 'GV001', ho_ten: 'Trần Thị Phương', bo_mon: 'Công nghệ phần mềm' },
    { id: 2, ma_gv: 'GV002', ho_ten: 'Lê Thanh Hùng', bo_mon: 'Khoa học máy tính' },
    { id: 3, ma_gv: 'GV003', ho_ten: 'Phạm Tuấn Minh', bo_mon: 'Hệ thống thông tin' },
    { id: 4, ma_gv: 'GV004', ho_ten: 'Nguyễn Thị Lan', bo_mon: 'Mạng máy tính' },
  ];

  // Mô phỏng dữ liệu kế hoạch mở nhóm học phần
  const mockCourseGroups = [
    {
      id: 1,
      hoc_phan_id: 1,
      ma_nhom: 'CS101.1',
      nam_hoc: '2023-2024',
      hoc_ky: 1,
      thoi_gian_bat_dau: '2023-09-01',
      thoi_gian_ket_thuc: '2023-12-15',
      so_luong_sv: 45,
      trang_thai: 1
      
    },
    {
      id: 2,
      hoc_phan_id: 2,
      ma_nhom: 'CS201.1',
      nam_hoc: '2023-2024',
      hoc_ky: 1,
      thoi_gian_bat_dau: '2023-09-01',
      thoi_gian_ket_thuc: '2023-12-15',
      so_luong_sv: 32,
      trang_thai: 1
    },
    {
      id: 3,
      hoc_phan_id: 3,
      ma_nhom: 'CS301.1',
      nam_hoc: '2023-2024',
      hoc_ky: 2,
      thoi_gian_bat_dau: '2024-02-15',
      thoi_gian_ket_thuc: '2024-05-30',
      so_luong_sv: 0,
      trang_thai: 0
    },
    {
      id: 4,
      hoc_phan_id: 4,
      ma_nhom: 'MA101.1',
      nam_hoc: '2023-2024',
      hoc_ky: 2,
      thoi_gian_bat_dau: '2024-02-15',
      thoi_gian_ket_thuc: '2024-05-30',
      so_luong_sv: 8,
      trang_thai: 0
    }
  ];

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Lấy dữ liệu từ API (mock data)
  const fetchData = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setCourseGroups(mockCourseGroups);
      setCourses(mockCourses);
      setSemesters(mockSemesters);
      setLecturers(mockLecturers);
      setLoading(false);
    }, 500);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Xử lý lọc theo học kỳ
  const handleSemesterFilter = (value) => {
    setSemesterFilter(value);
  };

  // Lọc dữ liệu theo điều kiện
  const filteredData = () => {
    let result = [...courseGroups];

    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(group => 
        group.ma_nhom.toLowerCase().includes(searchText.toLowerCase()) ||
        group.hoc_phan_id.toString().includes(searchText.toLowerCase()) ||
        group.hoc_ky.toString().includes(searchText.toLowerCase()) ||
        group.nam_hoc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo học kỳ
    if (semesterFilter !== 'all') {
      const semesterId = parseInt(semesterFilter);
      result = result.filter(group => group.hoc_ky === semesterId);
    }

    return result;
  };

  // Xử lý chỉnh sửa nhóm học phần
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      hoc_phan_id: record.hoc_phan_id,
      ma_nhom: record.ma_nhom,
      nam_hoc: record.nam_hoc,
      hoc_ky: record.hoc_ky,
      thoi_gian: [
        moment(record.thoi_gian_bat_dau), 
        moment(record.thoi_gian_ket_thuc)
      ],
      so_luong_sv: record.so_luong_sv,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Xử lý toggle trạng thái
  const handleToggleStatus = (record) => {
    const newStatus = record.trang_thai === 1 ? 0 : 1;
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      const updatedGroups = courseGroups.map(group => {
        if (group.id === record.id) {
          return { ...group, trang_thai: newStatus };
        }
        return group;
      });
      setCourseGroups(updatedGroups);
      Modal.success({
        content: `Kế hoạch mở nhóm đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
      });
      setLoading(false);
    }, 500);
  };

  // Xử lý xóa nhóm học phần
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa kế hoạch mở nhóm học phần này?',
      onOk: () => {
        setLoading(true);
        // Mô phỏng API call
        setTimeout(() => {
          const updatedGroups = courseGroups.filter(group => group.id !== id);
          setCourseGroups(updatedGroups);
          Modal.success({
            content: 'Xóa kế hoạch mở nhóm học phần thành công'
          });
          setLoading(false);
        }, 500);
      }
    });
  };

  // Xử lý submit form
  const handleSubmit = (values) => {
    setLoading(true);
    
    // Chuẩn bị dữ liệu từ form
    const groupData = {
      hoc_phan_id: values.hoc_phan_id,
      ma_nhom: values.ma_nhom,
      nam_hoc: values.nam_hoc,
      hoc_ky: values.hoc_ky,
      thoi_gian_bat_dau: values.thoi_gian[0].format('YYYY-MM-DD'),
      thoi_gian_ket_thuc: values.thoi_gian[1].format('YYYY-MM-DD'),
      so_luong_sv: values.so_luong_sv,
      trang_thai: values.trang_thai
    };
    
    if (editingId) {
      // Cập nhật nhóm học phần
      setTimeout(() => {
        const updatedGroups = courseGroups.map(group => {
          if (group.id === editingId) {
            return { ...group, ...groupData };
          }
          return group;
        });
        setCourseGroups(updatedGroups);
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Cập nhật kế hoạch mở nhóm học phần thành công'
        });
        setLoading(false);
      }, 500);
    } else {
      // Kiểm tra mã nhóm đã tồn tại chưa
      const existingGroup = courseGroups.some(
        group => group.ma_nhom === values.ma_nhom && 
                group.hoc_phan_id === values.hoc_phan_id
      );
      
      if (existingGroup) {
        Modal.error({
          content: 'Mã nhóm đã tồn tại cho học phần này!'
        });
        setLoading(false);
        return;
      }
      
      // Thêm nhóm học phần mới
      setTimeout(() => {
        const newGroup = {
          id: Math.max(...courseGroups.map(group => group.id), 0) + 1,
          ...groupData
        };
        setCourseGroups([...courseGroups, newGroup]);
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Thêm kế hoạch mở nhóm học phần mới thành công'
        });
        setLoading(false);
      }, 500);
    }
  };

  // Tạo mã nhóm tự động
  const generateGroupCode = () => {
    const courseId = form.getFieldValue('hoc_phan_id');
    if (!courseId) {
      Modal.warning({
        title: 'Cần chọn học phần',
        content: 'Vui lòng chọn học phần trước khi tạo mã nhóm'
      });
      return;
    }

    const course = courses.find(c => c.id === courseId);
    // Tìm số nhóm hiện có của học phần này
    const existingGroups = courseGroups.filter(g => g.ma_hoc_phan === course.ma_hoc_phan);
    const newGroupNumber = existingGroups.length + 1;
    
    const newGroupCode = `${course.ma_hoc_phan}.${newGroupNumber}`;
    form.setFieldsValue({ ma_nhom: newGroupCode });
  };

  // Lấy trạng thái hiển thị
  const getStatusDisplay = (status, registered, minRequired) => {
    switch (status) {
      case 'Đã mở lớp':
        return <Tag color="green">Đã mở lớp</Tag>;
      case 'Đang đăng ký':
        if (registered < minRequired) {
          return (
            <Tooltip title={`Cần thêm ${minRequired - registered} sinh viên để đạt tối thiểu`}>
              <Tag color="gold">Đang đăng ký ({registered}/{minRequired})</Tag>
            </Tooltip>
          );
        }
        return <Tag color="blue">Đang đăng ký</Tag>;
      case 'Chưa mở đăng ký':
        return <Tag color="default">Chưa mở đăng ký</Tag>;
      case 'Hủy mở lớp':
        return <Tag color="red">Hủy mở lớp</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
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
      title: 'Học phần ID',
      dataIndex: 'hoc_phan_id',
      key: 'hoc_phan_id',
      width: 120,
      render: (hocPhanId) => {
        const course = courses.find(c => c.id === hocPhanId);
        return (
          <Tooltip placement="topLeft" title={course?.ten_hoc_phan}>
            {course?.ma_hoc_phan || hocPhanId}
          </Tooltip>
        );
      },
      sorter: (a, b) => a.hoc_phan_id - b.hoc_phan_id,
    },
    {
      title: 'Mã nhóm',
      dataIndex: 'ma_nhom',
      key: 'ma_nhom',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.ma_nhom.localeCompare(b.ma_nhom),
    },
    {
      title: 'Năm học',
      dataIndex: 'nam_hoc',
      key: 'nam_hoc',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: (a, b) => a.nam_hoc.localeCompare(b.nam_hoc),
    },
    {
      title: 'Học kỳ',
      dataIndex: 'hoc_ky',
      key: 'hoc_ky',
      width: 80,
      align: 'center',
      render: (hocKy) => (
        <Tag color={hocKy === 1 ? 'blue' : hocKy === 2 ? 'green' : 'orange'}>
          {hocKy === 1 ? 'Học kỳ 1' : hocKy === 2 ? 'Học kỳ 2' : 'Học kỳ hè'}
        </Tag>
      ),
      sorter: (a, b) => a.hoc_ky - b.hoc_ky,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoi_gian_bat_dau',
      key: 'thoi_gian_bat_dau',
      width: 150,
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.thoi_gian_bat_dau).unix() - moment(b.thoi_gian_bat_dau).unix(),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoi_gian_ket_thuc',
      key: 'thoi_gian_ket_thuc',
      width: 150,
      render: (date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.thoi_gian_ket_thuc).unix() - moment(b.thoi_gian_ket_thuc).unix(),
    },
    {
      title: 'Số lượng SV',
      dataIndex: 'so_luong_sv',
      key: 'so_luong_sv',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.so_luong_sv - b.so_luong_sv,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 120,
      align: 'center',
      render: (trangThai) => (
        <Tag color={trangThai === 1 ? 'green' : 'red'}>
          {trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      sorter: (a, b) => a.trang_thai - b.trang_thai,
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
        <Title level={2} style={{ margin: 0 }}>Quản lý kế hoạch mở nhóm</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          <Select
            placeholder="Học kỳ"
            style={{ width: 250 }}
            value={semesterFilter}
            onChange={handleSemesterFilter}
          >
            <Option value="all">Tất cả học kỳ</Option>
            {semesters.map(semester => (
              <Option key={semester.id} value={semester.id.toString()}>
                {semester.ten_hoc_ky}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({ trang_thai: 1 });
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
          scroll={{ x: 1200 }}
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
        title={editingId ? "Cập nhật kế hoạch mở nhóm" : "Thêm kế hoạch mở nhóm mới"}
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
          <Divider orientation="left">Thông tin cơ bản</Divider>
          
          <Form.Item
            name="hoc_phan_id"
            label="Học phần"
            rules={[{ required: true, message: 'Vui lòng chọn học phần!' }]}
          >
            <Select placeholder="Chọn học phần" disabled={!!editingId}>
              {courses.map(course => (
                <Option key={course.id} value={course.id}>
                  {course.ma_hoc_phan} - {course.ten_hoc_phan}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ma_nhom"
            label="Mã nhóm"
            rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
          >
            <Input placeholder="Ví dụ: CS101.1" disabled={!!editingId} />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="nam_hoc"
              label="Năm học"
              rules={[{ required: true, message: 'Vui lòng nhập năm học!' }]}
              style={{ width: '50%' }}
            >
              <Input placeholder="Ví dụ: 2023-2024" />
            </Form.Item>
            
            <Form.Item
              name="hoc_ky"
              label="Học kỳ"
              rules={[{ required: true, message: 'Vui lòng chọn học kỳ!' }]}
              style={{ width: '50%' }}
            >
              <Select placeholder="Chọn học kỳ">
                <Option value={1}>Học kỳ 1</Option>
                <Option value={2}>Học kỳ 2</Option>
                <Option value={3}>Học kỳ hè</Option>
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            name="thoi_gian"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
          >
            <RangePicker 
              style={{ width: '100%' }} 
              locale={locale}
              format="DD/MM/YYYY"
            />
          </Form.Item>
          
          <Form.Item
            name="so_luong_sv"
            label="Số lượng sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng sinh viên!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="trang_thai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
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
                icon={<SaveOutlined />} 
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

export default ManageCourseGroups; 