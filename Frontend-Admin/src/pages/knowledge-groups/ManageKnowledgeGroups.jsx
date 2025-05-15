import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageKnowledgeGroups = () => {
  const [knowledgeGroups, setKnowledgeGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Mô phỏng dữ liệu nhóm kiến thức
  const mockData = [
    {
      id: 1,
      ma_nhom: 'KHDC',
      ten_nhom: 'Kiến thức đại cương',
      mo_ta: 'Các môn học cung cấp nền tảng kiến thức chung cho sinh viên.',
      so_tin_chi_toi_thieu: 30,
      trang_thai: 1
    },
    {
      id: 2,
      ma_nhom: 'KHCN',
      ten_nhom: 'Kiến thức cơ sở ngành',
      mo_ta: 'Các môn học cung cấp kiến thức cơ sở cho ngành học.',
      so_tin_chi_toi_thieu: 24,
      trang_thai: 1
    },
    {
      id: 3,
      ma_nhom: 'KHCN',
      ten_nhom: 'Kiến thức chuyên ngành',
      mo_ta: 'Các môn học chuyên sâu của ngành đào tạo.',
      so_tin_chi_toi_thieu: 36,
      trang_thai: 1
    },
    {
      id: 4,
      ma_nhom: 'TNTC',
      ten_nhom: 'Thực tập và tốt nghiệp',
      mo_ta: 'Hoạt động thực tập tại doanh nghiệp và thực hiện khóa luận tốt nghiệp.',
      so_tin_chi_toi_thieu: 10,
      trang_thai: 0
    }
  ];

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchKnowledgeGroups();
  }, []);

  // Hàm lấy dữ liệu nhóm kiến thức
  const fetchKnowledgeGroups = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setKnowledgeGroups(mockData);
      setLoading(false);
    }, 500);
  };

  // Xử lý sự kiện khi người dùng nhấn nút chỉnh sửa
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ma_nhom: record.ma_nhom,
      ten_nhom: record.ten_nhom,
      mo_ta: record.mo_ta,
      so_tin_chi_toi_thieu: record.so_tin_chi_toi_thieu,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Xử lý sự kiện khi người dùng xác nhận xóa
  const handleDelete = (groupId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa nhóm kiến thức này?',
      onOk: () => {
        setLoading(true);
        // Mô phỏng API call
        setTimeout(() => {
          const updatedGroups = knowledgeGroups.filter(group => group.id !== groupId);
          setKnowledgeGroups(updatedGroups);
          Modal.success({
            content: 'Xóa nhóm kiến thức thành công'
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
      const updatedGroups = knowledgeGroups.map(group => {
        if (group.id === record.id) {
          return { ...group, trang_thai: newStatus };
        }
        return group;
      });
      setKnowledgeGroups(updatedGroups);
      Modal.success({
        content: `Nhóm kiến thức đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
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
        const updatedGroups = knowledgeGroups.map(group => {
          if (group.id === editingId) {
            return { ...group, ...values };
          }
          return group;
        });
        setKnowledgeGroups(updatedGroups);
        setIsModalVisible(false);
        Modal.success({
          content: 'Cập nhật nhóm kiến thức thành công'
        });
        setLoading(false);
      }, 500);
    } else {
      // Mô phỏng API thêm mới
      setTimeout(() => {
        const newGroup = {
          id: Math.max(...knowledgeGroups.map(g => g.id), 0) + 1,
          ...values
        };
        setKnowledgeGroups([...knowledgeGroups, newGroup]);
        setIsModalVisible(false);
        Modal.success({
          content: 'Thêm nhóm kiến thức mới thành công'
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
    ? knowledgeGroups.filter(group => 
        group.ma_nhom.toLowerCase().includes(searchText.toLowerCase()) ||
        group.ten_nhom.toLowerCase().includes(searchText.toLowerCase())
      )
    : knowledgeGroups;

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
      title: 'Mã nhóm',
      dataIndex: 'ma_nhom',
      key: 'ma_nhom',
      width: 120,
      sorter: (a, b) => a.ma_nhom.localeCompare(b.ma_nhom),
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
      title: 'Tên nhóm kiến thức',
      dataIndex: 'ten_nhom',
      key: 'ten_nhom',
      width: 250,
      sorter: (a, b) => a.ten_nhom.localeCompare(b.ten_nhom),
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
      title: 'Số tín chỉ tối thiểu',
      dataIndex: 'so_tin_chi_toi_thieu',
      key: 'so_tin_chi_toi_thieu',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.so_tin_chi_toi_thieu - b.so_tin_chi_toi_thieu,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      width: 120,
      align: 'center',
      render: trang_thai => (
        <Tag color={trang_thai === 1 ? 'green' : 'red'}>
          {trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: 1 },
        { text: 'Không hoạt động', value: 0 },
      ],
      onFilter: (value, record) => record.trang_thai === value,
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
                title: `${record.ten_nhom} (${record.ma_nhom})`,
                content: (
                  <div>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Mã nhóm:</strong> {record.ma_nhom}</p>
                    <p><strong>Tên nhóm kiến thức:</strong> {record.ten_nhom}</p>
                    <p><strong>Mô tả:</strong> {record.mo_ta}</p>
                    <p><strong>Số tín chỉ tối thiểu:</strong> {record.so_tin_chi_toi_thieu}</p>
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
        <Title level={2}>Quản lý nhóm kiến thức</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên nhóm..."
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
                trang_thai: 1,
                so_tin_chi_toi_thieu: 12
              });
              setIsModalVisible(true);
            }}
          >
            Thêm nhóm kiến thức
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchKnowledgeGroups}
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
          scroll={{ x: 1000 }}
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
        title={editingId ? "Sửa thông tin nhóm kiến thức" : "Thêm nhóm kiến thức mới"}
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
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="ma_nhom"
              label="Mã nhóm"
              rules={[{ required: true, message: 'Vui lòng nhập mã nhóm!' }]}
              style={{ width: '50%' }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="so_tin_chi_toi_thieu"
              label="Số tín chỉ tối thiểu"
              rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ tối thiểu!' }]}
              style={{ width: '50%' }}
            >
              <Input type="number" min={0} />
            </Form.Item>
          </div>

          <Form.Item
            name="ten_nhom"
            label="Tên nhóm kiến thức"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm kiến thức!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mo_ta"
            label="Mô tả"
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

export default ManageKnowledgeGroups; 