import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, DatePicker, Divider, Upload, message, Tabs, Row, Col, Dropdown, Menu } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, UploadOutlined, SaveOutlined,
  BankOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, EnvironmentOutlined,
  BookOutlined, ApartmentOutlined, FieldTimeOutlined, NumberOutlined,
  FilterOutlined, SortAscendingOutlined, EyeOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

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

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, sortInfo, yearFilter]);

  // Hàm lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/thongTinChung');
      let filteredData = response.data;
      
      // Lọc theo từ khóa tìm kiếm (chỉ tìm theo tên chương trình)
      if (searchText) {
        filteredData = filteredData.filter(item => 
          item.tenCtdt.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Lọc theo năm ban hành
      if (yearFilter !== 'all') {
        const year = parseInt(yearFilter);
        filteredData = filteredData.filter(item => item.namBanHanh === year);
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
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
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
    form.setFieldsValue({
      ...record,
      namBanHanh: record.namBanHanh ? moment(record.namBanHanh) : null,
    });
    setIsModalVisible(true);
  };

  // Xử lý xóa
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thông tin chương trình đào tạo này?',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`http://localhost:8080/api/thongTinChung/${id}`);
          message.success('Xóa thông tin thành công');
          fetchData();
        } catch (error) {
          console.error('Error deleting:', error);
          message.error('Có lỗi xảy ra khi xóa thông tin');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Xử lý submit form
  const handleSubmit = (values) => {
    setLoading(true);
    
    if (editingId) {
      // Cập nhật thông tin
      setTimeout(() => {
        // Cập nhật mockGeneralInfos
        const index = generalInfos.findIndex(info => info.id === editingId);
        if (index !== -1) {
          const updatedInfo = { ...generalInfos[index], ...values };
          const updatedInfos = [
            ...generalInfos.slice(0, index),
            updatedInfo,
            ...generalInfos.slice(index + 1)
          ];
          setGeneralInfos(updatedInfos);
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
      const exists = generalInfos.some(info => info.maCtdt === values.maCtdt);
      if (exists) {
        Modal.error({
          content: 'Mã chương trình đào tạo đã tồn tại!'
        });
        setLoading(false);
        return;
      }
      
      // Thêm thông tin mới
      setTimeout(() => {
        const newId = Math.max(...generalInfos.map(info => info.id), 0) + 1;
        const newItem = {
          id: newId,
          ...values
        };
        
        // Cập nhật generalInfos
        setGeneralInfos(prev => [...prev, newItem]);
        
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
    setYearFilter('all');
    setSortInfo({ columnKey: null, order: null });
    setPagination(prev => ({
      ...prev,
      current: 1
    }));
    fetchData(); // Fetch data after resetting filters
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
      dataIndex: 'maCtdt',
      key: 'maCtdt',
      width: 120,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'maCtdt' ? sortInfo.order : null,
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
      dataIndex: 'tenCtdt',
      key: 'tenCtdt',
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
      sortOrder: sortInfo.columnKey === 'tenCtdt' ? sortInfo.order : null,
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
      dataIndex: 'maNganh',
      key: 'maNganh',
      width: 120,
      sorter: true,
      sortOrder: sortInfo.columnKey === 'maNganh' ? sortInfo.order : null,
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
      dataIndex: 'tongTinChi',
      key: 'tongTinChi',
      width: 120,
      align: 'center',
      sorter: true,
      sortOrder: sortInfo.columnKey === 'tongTinChi' ? sortInfo.order : null,
      render: (value) => <span style={{ fontWeight: 'bold' }}>{value}</span>
    },
    {
      title: 'Năm ban hành',
      dataIndex: 'namBanHanh',
      key: 'namBanHanh',
      width: 130,
      align: 'center',
      sorter: true,
      sortOrder: sortInfo.columnKey === 'namBanHanh' ? sortInfo.order : null,
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="default"
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </Button>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý CTĐT</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo tên chương trình..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
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
                heDaoTao: 'Chính quy',
                trinhDo: 'Đại học',
              });
              setIsModalVisible(true);
            }}
          >
            Thêm CTĐT
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleResetFilters}
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
                name="maCtdt"
                label="Mã chương trình đào tạo"
                rules={[{ required: true, message: 'Vui lòng nhập mã chương trình đào tạo!' }]}
              >
                <Input disabled={!!editingId} prefix={<BookOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="namBanHanh"
                label="Năm ban hành"
                rules={[{ required: true, message: 'Vui lòng nhập năm ban hành!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={2000} max={2100} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="tenCtdt"
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
                name="maNganh"
                label="Mã ngành"
                rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="khoaQuanLy"
            label="Khoa quản lý"
            rules={[{ required: true, message: 'Vui lòng nhập khoa quản lý!' }]}
          >
            <Input prefix={<ApartmentOutlined />} />
          </Form.Item>
          
          <Row gutter={[24, 0]}>
            <Col span={8}>
              <Form.Item
                name="heDaoTao"
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
                name="trinhDo"
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
                name="tongTinChi"
                label="Tổng tín chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập tổng số tín chỉ!' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={300} prefix={<NumberOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          
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
                  <Title level={4}>{detailInfo.tenCtdt}</Title>
                </Col>
                <Col span={12}>
                  <Text strong>ID:</Text> {detailInfo.id}
                </Col>
                <Col span={12}>
                  <Text strong>Mã CTĐT:</Text> {detailInfo.maCtdt}
                </Col>
              </Row>
              <div style={{ marginTop: 10 }}>
                <Tag color="blue">{detailInfo.nganh}</Tag>
                <Tag color="purple">Mã ngành: {detailInfo.maNganh}</Tag>
                <Tag color="cyan">Năm ban hành: {detailInfo.namBanHanh}</Tag>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Paragraph><BankOutlined /> <Text strong>Khoa quản lý:</Text> {detailInfo.khoaQuanLy}</Paragraph>
                <Paragraph><Text strong>Hệ đào tạo:</Text> {detailInfo.heDaoTao}</Paragraph>
                <Paragraph><Text strong>Trình độ:</Text> {detailInfo.trinhDo}</Paragraph>
              </Col>
              <Col span={12}>
                <Paragraph><NumberOutlined /> <Text strong>Tổng tín chỉ:</Text> {detailInfo.tongTinChi}</Paragraph>
                <Paragraph><FieldTimeOutlined /> <Text strong>Thời gian đào tạo:</Text> {detailInfo.thoiGianDaoTao}</Paragraph>
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