import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, InputNumber, 
  Tag, Tooltip, Divider, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, InfoCircleOutlined, LinkOutlined, EyeOutlined, BookOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// API base URL
const API_URL = 'http://localhost:8080';

// Thiết lập cấu hình global cho axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Thêm interceptor để xử lý lỗi từ API
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

const ManageCurriculumKnowledge = () => {
  const [curriculumKnowledge, setCurriculumKnowledge] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [knowledgeGroups, setKnowledgeGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [curriculumFilter, setCurriculumFilter] = useState('all');
  const [form] = Form.useForm();

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch danh sách khung chương trình
      const curriculumsResponse = await axios.get('/khungchuongtrinh');
      setCurriculums(curriculumsResponse.data);

      // Fetch danh sách nhóm kiến thức
      const knowledgeGroupsResponse = await axios.get('/nhomkienthuc');
      setKnowledgeGroups(knowledgeGroupsResponse.data);

      // Fetch danh sách liên kết khung chương trình - nhóm kiến thức
      const curriculumKnowledgeResponse = await axios.get('/khungchuongtrinh-nhomkienthuc');
      setCurriculumKnowledge(curriculumKnowledgeResponse.data);
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

  // Xử lý sự kiện khi người dùng tìm kiếm
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Xử lý lọc theo khung chương trình
  const handleCurriculumFilter = (value) => {
    setCurriculumFilter(value);
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm và bộ lọc
  const filteredData = () => {
    let result = [...curriculumKnowledge];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      result = result.filter(item => 
        item.ten_khung.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ma_khung.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ten_nhom.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ma_nhom.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Lọc theo khung chương trình
    if (curriculumFilter !== 'all') {
      const curriculumId = parseInt(curriculumFilter);
      result = result.filter(item => item.khung_chuong_trinh_id === curriculumId);
    }
    
    return result;
  };

  // Xử lý sự kiện khi người dùng nhấn nút chỉnh sửa
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      khung_chuong_trinh_id: record.khung_chuong_trinh_id,
      nhom_kien_thuc_id: record.nhom_kien_thuc_id,
      so_tin_chi_bat_buoc: record.so_tin_chi_bat_buoc,
      so_tin_chi_tu_chon: record.so_tin_chi_tu_chon,
      thu_tu_sap_xep: record.thu_tu_sap_xep,
      ghi_chu: record.ghi_chu,
      trang_thai: record.trang_thai
    });
    setIsModalVisible(true);
  };

  // Xử lý sự kiện khi người dùng xác nhận xóa
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mối liên kết này?',
      onOk: async () => {
        setLoading(true);
        try {
          // Thay vì xóa, chúng ta sẽ cập nhật trạng thái về 0
          await axios.put(`/khungchuongtrinh-nhomkienthuc/${id}`, {
            trang_thai: 0
          });
          
          const updatedData = curriculumKnowledge.map(item => {
            if (item.id === id) {
              return { ...item, trang_thai: 0 };
            }
            return item;
          });
          setCurriculumKnowledge(updatedData);
          Modal.success({
            content: 'Cập nhật trạng thái thành công'
          });
        } catch (error) {
          console.error('Error updating status:', error);
          Modal.error({
            title: 'Lỗi',
            content: 'Không thể cập nhật trạng thái. Vui lòng thử lại sau.'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Xử lý toggle trạng thái
  const handleToggleStatus = async (record) => {
    const newStatus = record.trang_thai === 1 ? 0 : 1;
    setLoading(true);
    try {
      await axios.put(`/khungchuongtrinh-nhomkienthuc/${record.id}`, {
        ...record,
        trang_thai: newStatus
      });
      
      const updatedData = curriculumKnowledge.map(item => {
        if (item.id === record.id) {
          return { ...item, trang_thai: newStatus };
        }
        return item;
      });
      setCurriculumKnowledge(updatedData);
      Modal.success({
        content: `Cập nhật trạng thái thành công`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể cập nhật trạng thái. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Xử lý sự kiện khi người dùng submit form thêm/sửa
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Tính tổng số tín chỉ
      const totalCredits = values.so_tin_chi_bat_buoc + values.so_tin_chi_tu_chon;
      
      // Lấy thông tin liên quan
      const curriculum = curriculums.find(c => c.id === values.khung_chuong_trinh_id);
      const knowledgeGroup = knowledgeGroups.find(k => k.id === values.nhom_kien_thuc_id);
      
      const itemData = {
        khung_chuong_trinh_id: values.khung_chuong_trinh_id,
        nhom_kien_thuc_id: values.nhom_kien_thuc_id,
        ten_khung: curriculum.ten_khung,
        ma_khung: curriculum.ma_khung,
        ten_nhom: knowledgeGroup.ten_nhom,
        ma_nhom: knowledgeGroup.ma_nhom,
        so_tin_chi_bat_buoc: values.so_tin_chi_bat_buoc,
        so_tin_chi_tu_chon: values.so_tin_chi_tu_chon,
        tong_so_tin_chi: totalCredits,
        thu_tu_sap_xep: values.thu_tu_sap_xep,
        ghi_chu: values.ghi_chu,
        trang_thai: values.trang_thai || 1 // Mặc định là 1 nếu không có giá trị
      };
      
      if (editingId) {
        // Cập nhật liên kết
        await axios.put(`/khungchuongtrinh-nhomkienthuc/${editingId}`, itemData);
        const updatedData = curriculumKnowledge.map(item => {
          if (item.id === editingId) {
            return { ...item, ...itemData };
          }
          return item;
        });
        setCurriculumKnowledge(updatedData);
        Modal.success({
          content: 'Cập nhật thành công'
        });
      } else {
        // Kiểm tra xem liên kết đã tồn tại chưa
        const exists = curriculumKnowledge.some(
          item => item.khung_chuong_trinh_id === values.khung_chuong_trinh_id && 
                  item.nhom_kien_thuc_id === values.nhom_kien_thuc_id &&
                  item.trang_thai === 1 // Chỉ kiểm tra các liên kết đang hoạt động
        );
        
        if (exists) {
          Modal.error({
            content: 'Liên kết giữa khung chương trình và nhóm kiến thức này đã tồn tại!'
          });
          setLoading(false);
          return;
        }
        
        // Thêm mới liên kết
        const response = await axios.post('/khungchuongtrinh-nhomkienthuc', itemData);
        setCurriculumKnowledge([...curriculumKnowledge, response.data]);
        Modal.success({
          content: 'Thêm mới thành công'
        });
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting form:', error);
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể lưu dữ liệu. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra tín chỉ có hợp lệ không
  const validateCredits = (_, value) => {
    const requiredCredits = form.getFieldValue('so_tin_chi_bat_buoc') || 0;
    const optionalCredits = form.getFieldValue('so_tin_chi_tu_chon') || 0;
    const totalCredits = requiredCredits + optionalCredits;
    
    const knowledgeGroupId = form.getFieldValue('nhom_kien_thuc_id');
    if (!knowledgeGroupId) return Promise.resolve();
    
    const minCredits = knowledgeGroups.find(k => k.id === knowledgeGroupId)?.so_tin_chi_toi_thieu || 0;
    
    if (totalCredits < minCredits) {
      return Promise.reject(`Tổng số tín chỉ (${totalCredits}) phải lớn hơn hoặc bằng số tín chỉ tối thiểu của nhóm kiến thức (${minCredits})!`);
    }
    
    return Promise.resolve();
  };

  // Kiểm tra mã nhóm đã tồn tại chưa
  const validateGroupCode = (_, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập mã nhóm!');
    }

    // Kiểm tra trong danh sách nhóm kiến thức
    const exists = knowledgeGroups.some(
      group => group.ma_nhom === value && group.id !== form.getFieldValue('id')
    );

    if (exists) {
      return Promise.reject('Mã nhóm này đã tồn tại!');
    }

    return Promise.resolve();
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
      title: 'Khung chương trình',
      key: 'khung_chuong_trinh',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.ten_khung}>
          {record.ma_khung}
        </Tooltip>
      ),
      sorter: (a, b) => a.ma_khung.localeCompare(b.ma_khung),
    },
    {
      title: 'Nhóm kiến thức',
      key: 'nhom_kien_thuc',
      width: 170,
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.ten_nhom}>
          {record.ma_nhom} - {record.ten_nhom}
        </Tooltip>
      ),
      sorter: (a, b) => a.ma_nhom.localeCompare(b.ma_nhom),
    },
    {
      title: 'Tín chỉ bắt buộc',
      dataIndex: 'so_tin_chi_bat_buoc',
      key: 'so_tin_chi_bat_buoc',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.so_tin_chi_bat_buoc - b.so_tin_chi_bat_buoc,
    },
    {
      title: 'Tín chỉ tự chọn',
      dataIndex: 'so_tin_chi_tu_chon',
      key: 'so_tin_chi_tu_chon',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.so_tin_chi_tu_chon - b.so_tin_chi_tu_chon,
    },
    {
      title: 'Tổng tín chỉ',
      dataIndex: 'tong_so_tin_chi',
      key: 'tong_so_tin_chi',
      width: 110,
      align: 'center',
      sorter: (a, b) => a.tong_so_tin_chi - b.tong_so_tin_chi,
      render: (text, record) => {
        const knowledgeGroup = knowledgeGroups.find(k => k.id === record.nhom_kien_thuc_id);
        const minCredits = knowledgeGroup?.so_tin_chi_toi_thieu || 0;
        
        return (
          <Tooltip title={`Tối thiểu: ${minCredits}`}>
            <Badge 
              status={record.tong_so_tin_chi >= minCredits ? 'success' : 'error'} 
              text={record.tong_so_tin_chi} 
            />
          </Tooltip>
        );
      }
    },
    {
      title: 'Thứ tự',
      dataIndex: 'thu_tu_sap_xep',
      key: 'thu_tu_sap_xep',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.thu_tu_sap_xep - b.thu_tu_sap_xep,
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
                title: `Chi tiết nhóm kiến thức trong khung chương trình`,
                content: (
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>ID:</Text>
                      <p>{record.id}</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Khung chương trình:</Text>
                      <p>{record.ten_khung} ({record.ma_khung})</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Nhóm kiến thức:</Text>
                      <p>{record.ten_nhom} ({record.ma_nhom})</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Thông tin tín chỉ:</Text>
                      <p>Tín chỉ bắt buộc: {record.so_tin_chi_bat_buoc}</p>
                      <p>Tín chỉ tự chọn: {record.so_tin_chi_tu_chon}</p>
                      <p>Tổng số tín chỉ: {record.tong_so_tin_chi}</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Thứ tự:</Text>
                      <p>{record.thu_tu_sap_xep}</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Ghi chú:</Text>
                      <p>{record.ghi_chu || 'Không có ghi chú'}</p>
                    </div>
                    
                    <div>
                      <Text strong>Trạng thái:</Text>
                      <p>{record.trang_thai === 1 ? 'Đang áp dụng' : 'Không áp dụng'}</p>
                    </div>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ color: '#1890ff' }}>
          QUẢN LÝ NHÓM KIẾN THỨC TRONG KHUNG CHƯƠNG TRÌNH
          <BookOutlined style={{ marginLeft: '10px' }} />
        </Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={handleSearch}
            allowClear
          />
          <Select
            placeholder="Khung chương trình"
            style={{ width: 250 }}
            value={curriculumFilter}
            onChange={handleCurriculumFilter}
          >
            <Option value="all">Tất cả khung chương trình</Option>
            {curriculums.map(curriculum => (
              <Option key={curriculum.id} value={curriculum.id.toString()}>
                {curriculum.ma_khung} - {curriculum.ten_khung}
              </Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trang_thai: 1,
                thu_tu_sap_xep: 1,
                so_tin_chi_bat_buoc: 0,
                so_tin_chi_tu_chon: 0
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
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
          size="middle"
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
        title={editingId ? "Cập nhật nhóm kiến thức trong khung chương trình" : "Thêm nhóm kiến thức vào khung chương trình"}
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
            name="khung_chuong_trinh_id"
            label="Khung chương trình"
            rules={[{ required: true, message: 'Vui lòng chọn khung chương trình!' }]}
          >
            <Select 
              placeholder="Chọn khung chương trình"
              disabled={!!editingId}
            >
              {curriculums.map(curriculum => (
                <Option key={curriculum.id} value={curriculum.id}>
                  {curriculum.ma_khung} - {curriculum.ten_khung}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nhom_kien_thuc_id"
            label="Nhóm kiến thức"
            rules={[
              { required: true, message: 'Vui lòng chọn nhóm kiến thức!' },
              { validator: validateGroupCode }
            ]}
          >
            <Select 
              placeholder="Chọn nhóm kiến thức"
              disabled={!!editingId}
              onChange={(value) => {
                const knowledgeGroup = knowledgeGroups.find(k => k.id === value);
                if (knowledgeGroup) {
                  form.setFieldsValue({
                    so_tin_chi_bat_buoc: knowledgeGroup.so_tin_chi_toi_thieu,
                    so_tin_chi_tu_chon: 0
                  });
                }
              }}
            >
              {knowledgeGroups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.ma_nhom} - {group.ten_nhom} (Tối thiểu: {group.so_tin_chi_toi_thieu} tín chỉ)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">Thông tin tín chỉ</Divider>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="so_tin_chi_bat_buoc"
              label="Số tín chỉ bắt buộc"
              rules={[
                { required: true, message: 'Vui lòng nhập số tín chỉ bắt buộc!' },
                { validator: validateCredits }
              ]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="so_tin_chi_tu_chon"
              label="Số tín chỉ tự chọn"
              rules={[
                { required: true, message: 'Vui lòng nhập số tín chỉ tự chọn!' },
                { validator: validateCredits }
              ]}
              style={{ width: '50%' }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.so_tin_chi_bat_buoc !== currentValues.so_tin_chi_bat_buoc ||
              prevValues.so_tin_chi_tu_chon !== currentValues.so_tin_chi_tu_chon ||
              prevValues.nhom_kien_thuc_id !== currentValues.nhom_kien_thuc_id
            }
          >
            {({ getFieldValue }) => {
              const requiredCredits = getFieldValue('so_tin_chi_bat_buoc') || 0;
              const optionalCredits = getFieldValue('so_tin_chi_tu_chon') || 0;
              const totalCredits = requiredCredits + optionalCredits;
              
              const knowledgeGroupId = getFieldValue('nhom_kien_thuc_id');
              const knowledgeGroup = knowledgeGroups.find(k => k.id === knowledgeGroupId);
              const minCredits = knowledgeGroup?.so_tin_chi_toi_thieu || 0;
              
              const isValid = totalCredits >= minCredits;
              
              return (
                <div style={{ marginBottom: 16 }}>
                  <Text>Tổng số tín chỉ: </Text>
                  <Text strong type={isValid ? 'success' : 'danger'}>
                    {totalCredits} 
                  </Text>
                  <Text type={isValid ? 'success' : 'danger'}>
                    {isValid 
                      ? ` (đạt yêu cầu tối thiểu ${minCredits} tín chỉ)` 
                      : ` (chưa đạt yêu cầu tối thiểu ${minCredits} tín chỉ)`
                    }
                  </Text>
                </div>
              );
            }}
          </Form.Item>

          <Divider orientation="left">Thông tin bổ sung</Divider>
          
          <Form.Item
            name="thu_tu_sap_xep"
            label="Thứ tự sắp xếp"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự sắp xếp!' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="ghi_chu"
            label="Ghi chú"
          >
            <TextArea rows={3} />
          </Form.Item>
          
          <Form.Item
            name="trang_thai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value={1}>Đang áp dụng</Option>
              <Option value={0}>Không áp dụng</Option>
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
              <Button type="primary" htmlType="submit" icon={<LinkOutlined />} loading={loading}>
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageCurriculumKnowledge; 