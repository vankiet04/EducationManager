import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Divider, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageGradeColumns = () => {
  const [gradeColumns, setGradeColumns] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Mô phỏng dữ liệu đề cương
  const mockSyllabuses = [
    { id: 1, ma_de_cuong: 'CS101_2023.1', ten_hoc_phan: 'Nhập môn lập trình' },
    { id: 2, ma_de_cuong: 'CS201_2023.1', ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật' },
    { id: 3, ma_de_cuong: 'CS301_2022.2', ten_hoc_phan: 'Cơ sở dữ liệu' },
    { id: 4, ma_de_cuong: 'MA101_2023.1', ten_hoc_phan: 'Đại số tuyến tính' },
  ];

  // Mô phỏng dữ liệu cột điểm
  const mockGradeColumns = [
    {
      id: 1,
      decuong_id: 1,
      ma_de_cuong: 'CS101_2023.1',
      ten_hoc_phan: 'Nhập môn lập trình',
      ten_cot_diem: 'Điểm quá trình 1',
      ty_le_phan_tram: 10.00,
      hinh_thuc: 'Bài tập về nhà',
      trang_thai: 1
    },
    {
      id: 2,
      decuong_id: 1,
      ma_de_cuong: 'CS101_2023.1',
      ten_hoc_phan: 'Nhập môn lập trình',
      ten_cot_diem: 'Điểm quá trình 2',
      ty_le_phan_tram: 10.00,
      hinh_thuc: 'Bài tập tại lớp',
      trang_thai: 1
    },
    {
      id: 3,
      decuong_id: 1,
      ma_de_cuong: 'CS101_2023.1',
      ten_hoc_phan: 'Nhập môn lập trình',
      ten_cot_diem: 'Điểm giữa kỳ',
      ty_le_phan_tram: 30.00,
      hinh_thuc: 'Thi tự luận',
      trang_thai: 1
    },
    {
      id: 4,
      decuong_id: 1,
      ma_de_cuong: 'CS101_2023.1',
      ten_hoc_phan: 'Nhập môn lập trình',
      ten_cot_diem: 'Điểm cuối kỳ',
      ty_le_phan_tram: 50.00,
      hinh_thuc: 'Thi tự luận',
      trang_thai: 1
    },
    {
      id: 5,
      decuong_id: 2,
      ma_de_cuong: 'CS201_2023.1',
      ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật',
      ten_cot_diem: 'Điểm bài tập lớn',
      ty_le_phan_tram: 30.00,
      hinh_thuc: 'Bài tập nhóm',
      trang_thai: 1
    },
    {
      id: 6,
      decuong_id: 2,
      ma_de_cuong: 'CS201_2023.1',
      ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật',
      ten_cot_diem: 'Điểm giữa kỳ',
      ty_le_phan_tram: 20.00,
      hinh_thuc: 'Thi tự luận',
      trang_thai: 1
    },
    {
      id: 7,
      decuong_id: 2,
      ma_de_cuong: 'CS201_2023.1',
      ten_hoc_phan: 'Cấu trúc dữ liệu và giải thuật',
      ten_cot_diem: 'Điểm cuối kỳ',
      ty_le_phan_tram: 50.00,
      hinh_thuc: 'Thi vấn đáp',
      trang_thai: 1
    },
  ];

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch dữ liệu
  const fetchData = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setSyllabuses(mockSyllabuses);
      setGradeColumns(mockGradeColumns);
      setLoading(false);
    }, 500);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
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
          const updatedGradeColumns = gradeColumns.filter(column => column.id !== id);
          setGradeColumns(updatedGradeColumns);
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
      const updatedGradeColumns = gradeColumns.map(column => {
        if (column.id === record.id) {
          return { ...column, trang_thai: newStatus };
        }
        return column;
      });
      setGradeColumns(updatedGradeColumns);
      Modal.success({
        content: `Cột điểm đã được ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công`
      });
      setLoading(false);
    }, 500);
  };

  // Xử lý submit form
  const handleSubmit = (values) => {
    setLoading(true);
    
    // Lấy thông tin đề cương
    const syllabus = syllabuses.find(s => s.id === values.decuong_id);
    
    if (editingId) {
      // Cập nhật cột điểm
      setTimeout(() => {
        const updatedGradeColumns = gradeColumns.map(column => {
          if (column.id === editingId) {
            return {
              ...column,
              decuong_id: values.decuong_id,
              ma_de_cuong: syllabus.ma_de_cuong,
              ten_hoc_phan: syllabus.ten_hoc_phan,
              ten_cot_diem: values.ten_cot_diem,
              ty_le_phan_tram: values.ty_le_phan_tram,
              hinh_thuc: values.hinh_thuc,
              trang_thai: values.trang_thai
            };
          }
          return column;
        });
        setGradeColumns(updatedGradeColumns);
        setIsModalVisible(false);
        form.resetFields();
        Modal.success({
          content: 'Cập nhật cột điểm thành công'
        });
        setLoading(false);
      }, 500);
    } else {
      // Thêm cột điểm mới
      setTimeout(() => {
        const newColumn = {
          id: Math.max(...gradeColumns.map(column => column.id), 0) + 1,
          decuong_id: values.decuong_id,
          ma_de_cuong: syllabus.ma_de_cuong,
          ten_hoc_phan: syllabus.ten_hoc_phan,
          ten_cot_diem: values.ten_cot_diem,
          ty_le_phan_tram: values.ty_le_phan_tram,
          hinh_thuc: values.hinh_thuc,
          trang_thai: values.trang_thai
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

  // Lọc dữ liệu
  const filterData = () => {
    let filteredData = [...gradeColumns];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      filteredData = filteredData.filter(item => 
        item.ten_cot_diem.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ma_de_cuong.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ten_hoc_phan.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.hinh_thuc && item.hinh_thuc.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    return filteredData;
  };

  // Định nghĩa các cột trong bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
      fixed: 'left',
      sorter: (a, b) => a.id - b.id,
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: 'Đề cương ID',
      dataIndex: 'decuong_id',
      key: 'decuong_id',
      width: 120,
      sorter: (a, b) => a.decuong_id - b.decuong_id,
      render: (id) => <span>{id}</span>,
      filters: syllabuses.map(s => ({
        text: `${s.id} - ${s.ma_de_cuong}`,
        value: s.id,
      })),
      onFilter: (value, record) => record.decuong_id === value,
    },
    {
      title: 'Tên cột điểm',
      dataIndex: 'ten_cot_diem',
      key: 'ten_cot_diem',
      width: 250,
      sorter: (a, b) => a.ten_cot_diem.localeCompare(b.ten_cot_diem),
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
      title: 'Tỷ lệ phần trăm',
      dataIndex: 'ty_le_phan_tram',
      key: 'ty_le_phan_tram',
      width: 150,
      align: 'center',
      sorter: (a, b) => a.ty_le_phan_tram - b.ty_le_phan_tram,
      render: (value) => {
        return <span style={{ fontWeight: 'bold' }}>{value}%</span>;
      }
    },
    {
      title: 'Hình thức',
      dataIndex: 'hinh_thuc',
      key: 'hinh_thuc',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text || 'Chưa có'}>
          {text || <span style={{ color: '#999' }}>Chưa có</span>}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      className: 'action-column',
      render: (_, record) => (
        <Space size="small" className="action-buttons">
          <Button 
            icon={<InfoCircleOutlined />}
            size="small"
            onClick={() => {
              Modal.info({
                title: `Chi tiết cột điểm: ${record.ten_cot_diem}`,
                width: 600,
                content: (
                  <div style={{ marginTop: 16 }}>
                    <p><strong>ID:</strong> {record.id}</p>
                    <p><strong>Đề cương ID:</strong> {record.decuong_id}</p>
                    <p><strong>Tên cột điểm:</strong> {record.ten_cot_diem}</p>
                    <p><strong>Tỷ lệ phần trăm:</strong> {record.ty_le_phan_tram}%</p>
                    <p><strong>Hình thức:</strong> {record.hinh_thuc || 'Chưa có'}</p>
                    {record.ma_de_cuong && <p><strong>Mã đề cương:</strong> {record.ma_de_cuong}</p>}
                    {record.ten_hoc_phan && <p><strong>Tên học phần:</strong> {record.ten_hoc_phan}</p>}
                    {record.trang_thai !== undefined && <p><strong>Trạng thái:</strong> {record.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>}
                  </div>
                ),
              });
            }}
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
          
          {record.trang_thai !== undefined && (
            <Button
              type={record.trang_thai === 1 ? 'default' : 'primary'}
              size="small"
              onClick={() => handleToggleStatus(record)}
            >
              {record.trang_thai === 1 ? 'Vô hiệu' : 'Kích hoạt'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý cột điểm</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo tên, đề cương..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
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
                ty_le_phan_tram: 0,
                trang_thai: 1
              });
              setIsModalVisible(true);
            }}
          >
            Thêm cột điểm
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
          bordered
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
        title={editingId ? "Cập nhật cột điểm" : "Thêm cột điểm mới"}
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
          <Form.Item
            name="decuong_id"
            label="Đề cương"
            rules={[{ required: true, message: 'Vui lòng chọn đề cương!' }]}
          >
            <Select
              placeholder="Chọn đề cương"
              showSearch
              optionFilterProp="children"
            >
              {syllabuses.map(s => (
                <Option key={s.id} value={s.id}>
                  {s.ma_de_cuong} - {s.ten_hoc_phan}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ten_cot_diem"
            label="Tên cột điểm"
            rules={[{ required: true, message: 'Vui lòng nhập tên cột điểm!' }]}
          >
            <Input placeholder="Ví dụ: Điểm quá trình 1, Điểm giữa kỳ..." />
          </Form.Item>

          <Form.Item
            name="ty_le_phan_tram"
            label="Tỷ lệ phần trăm"
            rules={[
              { required: true, message: 'Vui lòng nhập tỷ lệ phần trăm!' },
              { type: 'number', min: 0, max: 100, message: 'Tỷ lệ phải từ 0 đến 100!' },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              step={5}
              style={{ width: '100%' }}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            name="hinh_thuc"
            label="Hình thức"
          >
            <Input placeholder="Ví dụ: Thi tự luận, Bài tập về nhà..." />
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

export default ManageGradeColumns; 