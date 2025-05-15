import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, DatePicker, Divider, Upload, message, Tabs, Row, Col, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, UploadOutlined, SaveOutlined,
  BankOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, EnvironmentOutlined,
  BookOutlined, ApartmentOutlined, FieldTimeOutlined, NumberOutlined,
  FilterOutlined, SortAscendingOutlined, EyeOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ManageGeneralInfo = () => {
  const [generalInfos, setGeneralInfos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailInfo, setDetailInfo] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('1');
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`
  });
  const [sortInfo, setSortInfo] = useState({
    columnKey: null,
    order: null
  });
  const [yearFilter, setYearFilter] = useState('all');

  // Mô phỏng dữ liệu thông tin chung
  const mockGeneralInfos = [
    {
      id: 1,
      ma_ctdt: 'CNTT2020',
      ten_ctdt: 'Chương trình đào tạo ngành Công nghệ thông tin',
      nganh: 'Công nghệ thông tin',
      ma_nganh: '7480201',
      khoa_quan_ly: 'Khoa Công nghệ thông tin',
      he_dao_tao: 'Chính quy',
      trinh_do: 'Đại học',
      tong_tin_chi: 145,
      thoi_gian_dao_tao: '4 năm',
      nam_ban_hanh: 2020,
      trang_thai: 1
    },
    {
      id: 2,
      ma_ctdt: 'KTPM2020',
      ten_ctdt: 'Chương trình đào tạo ngành Kỹ thuật phần mềm',
      nganh: 'Kỹ thuật phần mềm',
      ma_nganh: '7480103',
      khoa_quan_ly: 'Khoa Công nghệ thông tin',
      he_dao_tao: 'Chính quy',
      trinh_do: 'Đại học',
      tong_tin_chi: 145,
      thoi_gian_dao_tao: '4 năm',
      nam_ban_hanh: 2020,
      trang_thai: 1
    },
    {
      id: 3,
      ma_ctdt: 'HTTT2021',
      ten_ctdt: 'Chương trình đào tạo ngành Hệ thống thông tin',
      nganh: 'Hệ thống thông tin',
      ma_nganh: '7480104',
      khoa_quan_ly: 'Khoa Công nghệ thông tin',
      he_dao_tao: 'Chính quy',
      trinh_do: 'Đại học',
      tong_tin_chi: 145,
      thoi_gian_dao_tao: '4 năm',
      nam_ban_hanh: 2021,
      trang_thai: 1
    },
    {
      id: 4,
      ma_ctdt: 'KHMT2021',
      ten_ctdt: 'Chương trình đào tạo ngành Khoa học máy tính',
      nganh: 'Khoa học máy tính',
      ma_nganh: '7480101',
      khoa_quan_ly: 'Khoa Công nghệ thông tin',
      he_dao_tao: 'Chính quy',
      trinh_do: 'Đại học',
      tong_tin_chi: 145,
      thoi_gian_dao_tao: '4 năm',
      nam_ban_hanh: 2021,
      trang_thai: 1
    },
    {
      id: 5,
      ma_ctdt: 'DTVT2022',
      ten_ctdt: 'Chương trình đào tạo ngành Điện tử viễn thông',
      nganh: 'Điện tử viễn thông',
      ma_nganh: '7520207',
      khoa_quan_ly: 'Khoa Điện tử - Viễn thông',
      he_dao_tao: 'Chính quy',
      trinh_do: 'Đại học',
      tong_tin_chi: 150,
      thoi_gian_dao_tao: '4 năm',
      nam_ban_hanh: 2022,
      trang_thai: 1
    }
  ];

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, sortInfo, statusFilter, yearFilter]);

  // Hàm lấy dữ liệu
  const fetchData = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      let filteredData = [...mockGeneralInfos];
      
      // Lọc theo từ khóa tìm kiếm
      if (searchText) {
        filteredData = filteredData.filter(item => 
          item.ma_ctdt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ten_ctdt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.nganh.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ma_nganh.toLowerCase().includes(searchText.toLowerCase()) ||
          item.khoa_quan_ly.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Lọc theo trạng thái
      if (statusFilter !== 'all') {
        const status = parseInt(statusFilter);
        filteredData = filteredData.filter(item => item.trang_thai === status);
      }
      
      // Lọc theo năm ban hành
      if (yearFilter !== 'all') {
        const year = parseInt(yearFilter);
        filteredData = filteredData.filter(item => item.nam_ban_hanh === year);
      }
      
      // Sắp xếp
      if (sortInfo.columnKey && sortInfo.order) {
        filteredData = [...filteredData].sort((a, b) => {
          const columnKey = sortInfo.columnKey;
          
          if (typeof a[columnKey] === 'string') {
            if (sortInfo.order === 'ascend') {
              return a[columnKey].localeCompare(b[columnKey]);
            } else {
              return b[columnKey].localeCompare(a[columnKey]);
            }
          } else {
            if (sortInfo.order === 'ascend') {
              return a[columnKey] - b[columnKey];
            } else {
              return b[columnKey] - a[columnKey];
            }
          }
        });
      }
      
      const total = filteredData.length;
      
      // Phân trang
      const startIndex = (pagination.current - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setGeneralInfos(paginatedData);
      setPagination(prev => ({
        ...prev,
        total
      }));
      setLoading(false);
    }, 500);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Xử lý lọc theo năm ban hành
  const handleYearFilter = (value) => {
    setYearFilter(value);
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Xử lý thay đổi trang
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
    
    if (sorter && sorter.columnKey) {
      setSortInfo({
        columnKey: sorter.columnKey,
        order: sorter.order
      });
    } else {
      setSortInfo({
        columnKey: null,
        order: null
      });
    }
  };

  // Xử lý xem chi tiết
  const handleViewDetail = (record) => {
    setDetailInfo(record);
    setIsDetailModalVisible(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (record) => {
    setEditingId(record.id);
    setFileList([
      {
        uid: '-1',
        name: record.logo_url.split('/').pop(),
        status: 'done',
        url: record.logo_url,
      },
    ]);
    form.setFieldsValue({
      ...record,
      nam_thanh_lap: record.nam_thanh_lap ? moment(record.nam_thanh_lap) : null,
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thông tin chương trình đào tạo này?',
      onOk: () => {
        setLoading(true);
        // Mô phỏng API call
        setTimeout(() => {
          const updatedInfos = mockGeneralInfos.filter(info => info.id !== id);
          // Cập nhật mockGeneralInfos
          mockGeneralInfos.length = 0;
          mockGeneralInfos.push(...updatedInfos);
          
          // Refresh dữ liệu
          fetchData();
          
          Modal.success({
            content: 'Xóa thông tin thành công'
          });
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
      // Cập nhật mockGeneralInfos
      const index = mockGeneralInfos.findIndex(info => info.id === record.id);
      if (index !== -1) {
        mockGeneralInfos[index].trang_thai = newStatus;
      }
      
      // Refresh dữ liệu
      fetchData();
      
      Modal.success({
        content: `Chương trình đào tạo đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
      });
    }, 500);
  };

  // Xử lý submit form
  const handleSubmit = (values) => {
    setLoading(true);
    
    if (editingId) {
      // Cập nhật thông tin
      setTimeout(() => {
        // Cập nhật mockGeneralInfos
        const index = mockGeneralInfos.findIndex(info => info.id === editingId);
        if (index !== -1) {
          mockGeneralInfos[index] = { ...mockGeneralInfos[index], ...values };
        }
        
        // Refresh dữ liệu
        fetchData();
        
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Cập nhật thông tin thành công'
        });
      }, 500);
    } else {
      // Kiểm tra trùng mã chương trình đào tạo
      const exists = mockGeneralInfos.some(info => info.ma_ctdt === values.ma_ctdt);
      if (exists) {
        Modal.error({
          content: 'Mã chương trình đào tạo đã tồn tại!'
        });
        setLoading(false);
        return;
      }
      
      // Thêm thông tin mới
      setTimeout(() => {
        const newId = Math.max(...mockGeneralInfos.map(info => info.id), 0) + 1;
        const newItem = {
          id: newId,
          ...values
        };
        
        // Cập nhật mockGeneralInfos
        mockGeneralInfos.push(newItem);
        
        // Refresh dữ liệu
        fetchData();
        
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Thêm thông tin mới thành công'
        });
      }, 500);
    }
  };

  // Xử lý reset tất cả bộ lọc
  const handleResetFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setYearFilter('all');
    setSortInfo({ columnKey: null, order: null });
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
  };

  // Định nghĩa các cột trong bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
      sorter: true,
      sortOrder: sortInfo.columnKey === 'id' ? sortInfo.order : null,
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: 'Mã CTĐT',
      dataIndex: 'ma_ctdt',
      key: 'ma_ctdt',
      width: 120,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'ma_ctdt' ? sortInfo.order : null,
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
      title: 'Tên chương trình đào tạo',
      dataIndex: 'ten_ctdt',
      key: 'ten_ctdt',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
      sorter: true,
      sortOrder: sortInfo.columnKey === 'ten_ctdt' ? sortInfo.order : null,
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
      sortOrder: sortInfo.columnKey === 'nganh' ? sortInfo.order : null,
    },
    {
      title: 'Mã ngành',
      dataIndex: 'ma_nganh',
      key: 'ma_nganh',
      width: 120,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'ma_nganh' ? sortInfo.order : null,
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
      dataIndex: 'tong_tin_chi',
      key: 'tong_tin_chi',
      width: 120,
      align: 'center',
      sorter: true,
      sortOrder: sortInfo.columnKey === 'tong_tin_chi' ? sortInfo.order : null,
      render: (value) => <span style={{ fontWeight: 'bold' }}>{value}</span>
    },
    {
      title: 'Năm ban hành',
      dataIndex: 'nam_ban_hanh',
      key: 'nam_ban_hanh',
      width: 130,
      align: 'center',
      sorter: true,
      sortOrder: sortInfo.columnKey === 'nam_ban_hanh' ? sortInfo.order : null,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 120,
      align: 'center',
      render: trang_thai => (
        <Tag color={trang_thai === 1 ? 'green' : 'red'} style={{ minWidth: '80px', textAlign: 'center' }}>
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
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          />
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

  // Lấy danh sách năm ban hành để tạo bộ lọc
  const years = [...new Set(mockGeneralInfos.map(item => item.nam_ban_hanh))].sort();

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý CTĐT</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            value={searchText}
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
            <Option value="1">Hoạt động</Option>
            <Option value="0">Không hoạt động</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trang_thai: 1,
                he_dao_tao: 'Chính quy',
                trinh_do: 'Đại học',
              });
              setIsModalVisible(true);
            }}
          >
            Thêm CTĐT
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              handleResetFilters();
              fetchData();
            }}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={generalInfos}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          size="middle"
          scroll={{ x: 1300 }}
          bordered={false}
        />
      </div>

      {/* Modal thêm/sửa thông tin */}
      <Modal
        title={editingId ? "Cập nhật thông tin chương trình đào tạo" : "Thêm chương trình đào tạo mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                name="ma_ctdt"
                label="Mã chương trình đào tạo"
                rules={[{ required: true, message: 'Vui lòng nhập mã chương trình đào tạo!' }]}
              >
                <Input disabled={!!editingId} prefix={<BookOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nam_ban_hanh"
                label="Năm ban hành"
                rules={[{ required: true, message: 'Vui lòng nhập năm ban hành!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="ten_ctdt"
            label="Tên chương trình đào tạo"
            rules={[{ required: true, message: 'Vui lòng nhập tên chương trình đào tạo!' }]}
          >
            <Input />
          </Form.Item>
          
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                name="nganh"
                label="Ngành"
                rules={[{ required: true, message: 'Vui lòng nhập ngành!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ma_nganh"
                label="Mã ngành"
                rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="khoa_quan_ly"
            label="Khoa quản lý"
            rules={[{ required: true, message: 'Vui lòng nhập khoa quản lý!' }]}
          >
            <Input prefix={<ApartmentOutlined />} />
          </Form.Item>
          
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <Form.Item
                name="he_dao_tao"
                label="Hệ đào tạo"
                rules={[{ required: true, message: 'Vui lòng chọn hệ đào tạo!' }]}
              >
                <Select>
                  <Option value="Chính quy">Chính quy</Option>
                  <Option value="Liên thông">Liên thông</Option>
                  <Option value="Từ xa">Từ xa</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="trinh_do"
                label="Trình độ"
                rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
              >
                <Select>
                  <Option value="Đại học">Đại học</Option>
                  <Option value="Cao đẳng">Cao đẳng</Option>
                  <Option value="Thạc sĩ">Thạc sĩ</Option>
                  <Option value="Tiến sĩ">Tiến sĩ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
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
            </Col>
          </Row>
          
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Form.Item
                name="tong_tin_chi"
                label="Tổng tín chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập tổng số tín chỉ!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={300} prefix={<NumberOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="thoi_gian_dao_tao"
                label="Thời gian đào tạo"
                rules={[{ required: true, message: 'Vui lòng nhập thời gian đào tạo!' }]}
              >
                <Input prefix={<FieldTimeOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

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

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết chương trình đào tạo"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsDetailModalVisible(false);
              handleEdit(detailInfo);
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
        width={700}
      >
        {detailInfo && (
          <>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <Title level={4}>{detailInfo.ten_ctdt}</Title>
                </Col>
                <Col span={12}>
                  <Text strong>ID:</Text> {detailInfo.id}
                </Col>
                <Col span={12}>
                  <Text strong>Mã CTĐT:</Text> {detailInfo.ma_ctdt}
                </Col>
              </Row>
              <div style={{ marginTop: 10 }}>
                <Tag color="blue">{detailInfo.nganh}</Tag>
                <Tag color="purple">Mã ngành: {detailInfo.ma_nganh}</Tag>
                <Tag color="cyan">Năm ban hành: {detailInfo.nam_ban_hanh}</Tag>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Paragraph><BankOutlined /> <Text strong>Khoa quản lý:</Text> {detailInfo.khoa_quan_ly}</Paragraph>
                <Paragraph><Text strong>Hệ đào tạo:</Text> {detailInfo.he_dao_tao}</Paragraph>
                <Paragraph><Text strong>Trình độ:</Text> {detailInfo.trinh_do}</Paragraph>
              </Col>
              <Col span={12}>
                <Paragraph><NumberOutlined /> <Text strong>Tổng tín chỉ:</Text> {detailInfo.tong_tin_chi}</Paragraph>
                <Paragraph><FieldTimeOutlined /> <Text strong>Thời gian đào tạo:</Text> {detailInfo.thoi_gian_dao_tao}</Paragraph>
                <Paragraph><Text strong>Trạng thái:</Text> <Tag color={detailInfo.trang_thai === 1 ? 'green' : 'red'}>
                  {detailInfo.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                </Tag></Paragraph>
              </Col>
            </Row>
          </>
        )}
      </Modal>

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
    </Card>
  );
};

export default ManageGeneralInfo; 