// ManageLecturer.jsx - Trang quản lý giảng viên
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Input, Card, Modal, Form, Select, Tooltip, message, Row, Col, Statistic, Divider, List, Badge, Upload } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, PieChartOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';

const { Title } = Typography;
const { Option } = Select;

// API base URL
const API_URL = 'http://localhost:8080/api';

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
      // Show error message to user
      message.error(error.response.data.message || 'Có lỗi xảy ra');
    }
    return Promise.reject(error);
  }
);

const ManageLecturer = () => {
  const [lecturers, setLecturers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    byLevel: {},
    byFaculty: {},
    roles: {
      truongKhoa: 0,
      giangVien: 0
    },
    userStatus: {
      linked: 0,
      notLinked: 0
    }
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Fetch lecturer data and combine with user data
  const fetchLecturers = async () => {
    setLoading(true);
    try {
      // Get lecturers
      const res = await axios.get('/api/giangvien');
      
      // Filter to show only active lecturers (trangThai = 1)
      const activeLecturers = res.data.filter(lecturer => lecturer.trangThai === 1);
      
      // Get users for the dropdown
      const usersRes = await axios.get('/api/user');
      const users = usersRes.data;
      
      // Find user details for each lecturer
      const enrichedLecturers = activeLecturers.map(lecturer => {
        if (lecturer.userId) {
          const user = users.find(u => u.id === lecturer.userId);
          if (user) {
            return {
              ...lecturer,
              user_username: user.username,
              user_email: user.email
            };
          }
        }
        return {
          ...lecturer,
          user_username: null,
          user_email: null
        };
      });
      
      // Filter out users that are already assigned to lecturers
      const assignedUserIds = activeLecturers
        .filter(lecturer => lecturer.userId !== null)
        .map(lecturer => lecturer.userId);
      
      const availableUsersFiltered = users
        .filter(user => !assignedUserIds.includes(user.id) && user.trangThai === true);
      
      setLecturers(enrichedLecturers);
      setAvailableUsers(availableUsersFiltered);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải danh sách giảng viên';
      message.error(errorMessage);
      // Set empty arrays as fallback
      setLecturers([]);
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a lecturer
  const handleEdit = async (record) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/giangvien/${record.id}`);
      const lecturerData = response.data;
      
      setEditingId(record.id);
      form.setFieldsValue({
        maGiangVien: lecturerData.maGiangVien,
        hoTen: lecturerData.hoTen,
        boMon: lecturerData.boMon,
        khoa: lecturerData.khoa,
        trinhDo: lecturerData.trinhDo,
        chuyenMon: lecturerData.chuyenMon,
        userId: lecturerData.userId,
        trangThai: lecturerData.trangThai
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching lecturer details:', error);
      message.error('Không thể tải thông tin giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a lecturer
  const handleDelete = async (lecturerId) => {
    Modal.confirm({
      title: 'Xác nhận vô hiệu hóa giảng viên',
      content: 'Bạn có chắc chắn muốn vô hiệu hóa giảng viên này? Giảng viên sẽ không còn hiển thị trong danh sách.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/giangvien/${lecturerId}`);
          message.success('Vô hiệu hóa giảng viên thành công');
          fetchLecturers();
        } catch (error) {
          console.error('Error deactivating lecturer:', error);
          message.error('Không thể vô hiệu hóa giảng viên');
        } finally {
          setLoading(false);
        }
      }
    });
  };


  // Handle form submit (add/edit lecturer)
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Ensure all fields are properly formatted
      const lecturerData = {
        id: editingId || null,
        maGiangVien: values.maGiangVien?.trim(),
        hoTen: values.hoTen?.trim(),
        boMon: values.boMon?.trim(),
        khoa: values.khoa?.trim(),
        trinhDo: values.trinhDo,
        chuyenMon: values.chuyenMon?.trim(),
        userId: values.userId || null, // Ensure null if not provided
        trangThai: 1 // Always set to active
      };
      
      console.log('Sending lecturer data:', lecturerData);
          if (editingId) {
      // Update existing lecturer
      console.log('Updating lecturer with ID:', editingId);
      console.log('Update data:', lecturerData);
      const response = await axios.put(`/api/giangvien/${editingId}`, lecturerData);
      console.log('Update response:', response.data);
      message.success('Cập nhật giảng viên thành công');
    } else {
      // Create new lecturer
      console.log('Creating new lecturer:', lecturerData);
      const response = await axios.post('/api/giangvien', lecturerData);
      console.log('Create response:', response.data);
      message.success('Thêm giảng viên mới thành công');
    }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchLecturers(); // Refresh the list
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin giảng viên';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique lecturer code
  const generateLecturerCode = async () => {
    try {
      setLoading(true);
      
      // Fetch all lecturer codes (including inactive ones)
      const response = await axios.get('/api/giangvien/codes');
      const existingCodes = response.data || [];
      
      const prefix = "GV";
      let newCode;
      let counter = 1;
      
      do {
        newCode = `${prefix}${counter.toString().padStart(3, '0')}`;
        counter++;
      } while (existingCodes.includes(newCode));
      
      form.setFieldsValue({
        maGiangVien: newCode
      });
      
      message.success('Đã tạo mã giảng viên: ' + newCode);
    } catch (error) {
      console.error('Error generating lecturer code:', error);
      message.error('Không thể tạo mã giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = searchText
    ? lecturers.filter(lecturer => 
        lecturer.maGiangVien?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.boMon?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.khoa?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.user_username?.toLowerCase().includes(searchText.toLowerCase()) ||
        lecturer.user_email?.toLowerCase().includes(searchText.toLowerCase())
      )
    : lecturers;

  // Calculate statistics for lecturers
  const calculateStats = () => {
    // Count total number of lecturers
    const total = lecturers.length;
    
    // Group lecturers by education level
    const byLevel = lecturers.reduce((acc, lecturer) => {
      const level = lecturer.trinhDo || 'Không xác định';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    // Group lecturers by faculty/department
    const byFaculty = lecturers.reduce((acc, lecturer) => {
      const faculty = lecturer.khoa || 'Không xác định';
      acc[faculty] = (acc[faculty] || 0) + 1;
      return acc;
    }, {});

    // Count lecturers with roles (assuming role information is in chuyenMon or boMon field)
    const roles = {
      truongKhoa: lecturers.filter(lecturer => 
        lecturer.chuyenMon?.toLowerCase().includes('trưởng khoa') || 
        lecturer.boMon?.toLowerCase().includes('trưởng khoa')
      ).length,
      giangVien: lecturers.filter(lecturer => 
        !(lecturer.chuyenMon?.toLowerCase().includes('trưởng khoa') || 
          lecturer.boMon?.toLowerCase().includes('trưởng khoa'))
      ).length
    };

    // Count lecturers with/without user accounts
    const userStatus = {
      linked: lecturers.filter(lecturer => lecturer.userId).length,
      notLinked: lecturers.filter(lecturer => !lecturer.userId).length
    };
    
    setStatsData({
      total,
      byLevel,
      byFaculty,
      roles,
      userStatus
    });
    
    setIsStatsModalVisible(true);
  };

  // Define table columns
  const columns = [
    {
      title: 'Mã GV',
      dataIndex: 'maGiangVien',
      key: 'maGiangVien',
      width: 120,
      sorter: (a, b) => a.maGiangVien?.localeCompare(b.maGiangVien),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.hoTen?.localeCompare(b.hoTen),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Bộ môn',
      dataIndex: 'boMon',
      key: 'boMon',
      width: 150,
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
      title: 'Khoa',
      dataIndex: 'khoa',
      key: 'khoa',
      width: 150,
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
      title: 'Trình độ',
      dataIndex: 'trinhDo',
      key: 'trinhDo',
      width: 120,
    },
    {
      title: 'Tài khoản',
      dataIndex: 'user_username',
      key: 'user_username',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.user_username?.localeCompare(b.user_username),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text || 'Chưa gán'}
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
      width: 180,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.user_email?.localeCompare(b.user_email),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Chuyên môn',
      dataIndex: 'chuyenMon',
      key: 'chuyenMon',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.chuyenMon?.localeCompare(b.chuyenMon),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Vô hiệu hóa
          </Button>
        </Space>
      ),
    },
  ];

  // Update form to remove trangThai field
  const renderForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="maGiangVien"
        label="Mã giảng viên"
        rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
      >
        <Input 
          disabled={!!editingId}
          addonAfter={
            !editingId && 
            <Button 
              type="link" 
              size="small" 
              onClick={() => generateLecturerCode()}
              style={{ margin: -7 }}
              loading={loading}
            >
              Tạo mã
            </Button>
          }
        />
      </Form.Item>
      
      <Form.Item
        name="hoTen"
        label="Họ và tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="boMon"
        label="Bộ môn"
        rules={[{ required: true, message: 'Vui lòng nhập bộ môn!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="khoa"
        label="Khoa"
        rules={[{ required: true, message: 'Vui lòng nhập khoa!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="trinhDo"
        label="Trình độ"
        rules={[{ required: true, message: 'Vui lòng chọn trình độ!' }]}
      >
        <Select>
          <Option value="">-- Chọn trình độ --</Option>
          <Option value="Thạc sĩ">Thạc sĩ</Option>
          <Option value="Tiến sĩ">Tiến sĩ</Option>
          <Option value="Phó Giáo sư">Phó Giáo sư</Option>
          <Option value="Giáo sư">Giáo sư</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="chuyenMon"
        label="Chuyên môn"
        rules={[{ required: true, message: 'Vui lòng nhập chuyên môn!' }]}
      >
        <Input.TextArea placeholder="Các lĩnh vực chuyên môn, ngăn cách bằng dấu phẩy" />
      </Form.Item>

      <Form.Item
        name="userId"
        label="Tài khoản người dùng"
        tooltip={
          editingId 
            ? 'Nếu muốn thay đổi tài khoản, hãy chọn một tài khoản mới. Nếu không, hãy giữ nguyên tài khoản hiện tại'
            : 'Vui lòng chọn tài khoản để liên kết với giảng viên'
        }
        rules={[
          { 
            required: !editingId, 
            message: 'Vui lòng chọn tài khoản!'
          }
        ]}
      >
        <Select placeholder="Chọn tài khoản" style={{ width: '100%' }}>
          {editingId && form.getFieldValue('userId') && (
            <Option key={form.getFieldValue('userId')} value={form.getFieldValue('userId')}>
              {lecturers.find(l => l.id === editingId)?.user_username || 'Unknown'} (Tài khoản hiện tại)
            </Option>
          )}
          {availableUsers.map(user => (
            <Option key={user.id} value={user.id}>
              {user.username} - {user.hoTen || ''} ({user.email || ''})
            </Option>
          ))}
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
  );

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data:', jsonData); // Log để kiểm tra dữ liệu
        console.log('First row:', jsonData[0]); // Log row đầu tiên
        console.log('Headers:', Object.keys(jsonData[0])); // Log tên các cột

        // Validate required columns and normalize header names
        const headerMap = {
          'Họ và tên': 'họ tên',
          'Họ Tên': 'họ tên',
          'ho ten': 'họ tên',
          'Bộ môn': 'bộ môn',
          'Bo mon': 'bộ môn',
          'Khoa': 'khoa',
          'Trình độ': 'trình độ',
          'Trinh do': 'trình độ',
          'Chuyên môn': 'chuyên môn',
          'Chuyen mon': 'chuyên môn'
        };

        // Normalize headers
        const normalizedHeaders = {};
        Object.keys(jsonData[0]).forEach(header => {
          normalizedHeaders[header] = headerMap[header] || header.toLowerCase();
        });

        console.log('Normalized headers:', normalizedHeaders);

        // Validate required columns with normalized headers
        const requiredColumns = ['họ tên', 'bộ môn', 'khoa', 'trình độ', 'chuyên môn'];
        const headers = Object.values(normalizedHeaders);
        
        const missingColumns = requiredColumns.filter(col => 
          !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          Modal.error({
            title: 'Lỗi định dạng file',
            content: `File thiếu các cột bắt buộc: ${missingColumns.join(', ')}\nCác cột hiện có: ${headers.join(', ')}`
          });
          return;
        }

        // Process data with normalized headers
        const lecturers = jsonData.map(row => {
          const normalized = {};
          Object.keys(row).forEach(key => {
            const normalizedKey = normalizedHeaders[key];
            normalized[normalizedKey] = row[key];
          });

          return {
            maGiangVien: null, // Will be auto-generated
            hoTen: normalized['họ tên'],
            boMon: normalized['bộ môn'],
            khoa: normalized['khoa'],
            trinhDo: validateTrinhDo(normalized['trình độ']),
            chuyenMon: normalized['chuyên môn'],
            trangThai: 1
          };
        });

        console.log('Processed lecturers:', lecturers); // Log dữ liệu sau khi xử lý

        // Import lecturers
        importLecturers(lecturers);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        Modal.error({
          title: 'Lỗi xử lý file',
          content: 'Không thể đọc dữ liệu từ file Excel. Vui lòng kiểm tra định dạng file và tên các cột.'
        });
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent default upload behavior
  };

  const validateTrinhDo = (trinhDo) => {
    const validLevels = ['Thạc sĩ', 'Tiến sĩ', 'Phó Giáo sư', 'Giáo sư'];
    const normalized = trinhDo?.trim();
    return validLevels.includes(normalized) ? normalized : 'Thạc sĩ';
  };

  const importLecturers = async (lecturers) => {
    try {
      setLoading(true);
      
      // Generate lecturer codes
      const response = await axios.get('/api/giangvien/codes');
      const existingCodes = response.data || [];
      
      // Generate unique codes for all lecturers first
      for (let lecturer of lecturers) {
        const prefix = "GV";
        let counter = 1;
        let newCode;
        
        do {
          newCode = `${prefix}${counter.toString().padStart(3, '0')}`;
          counter++;
        } while (existingCodes.includes(newCode));
        
        lecturer.maGiangVien = newCode;
        existingCodes.push(newCode); // Add to existing to avoid duplicates
      }

      // Import lecturers one by one since batch endpoint may not be available
      let successCount = 0;
      for (const lecturer of lecturers) {
        try {
          await axios.post('/api/giangvien', {
            ...lecturer,
            trangThai: 1
          });
          successCount++;
        } catch (err) {
          console.error('Error importing lecturer:', lecturer, err);
          // Continue with next lecturer even if one fails
        }
      }

      if (successCount > 0) {
        Modal.success({
          title: 'Import thành công',
          content: `Đã thêm ${successCount} giảng viên vào hệ thống.`
        });
        setIsImportModalVisible(false);
        fetchLecturers(); // Refresh list
      } else {
        throw new Error('Không thể import bất kỳ giảng viên nào');
      }
    } catch (error) {
      console.error('Error importing lecturers:', error);
      Modal.error({
        title: 'Lỗi import',
        content: error.response?.data?.message || 'Không thể import giảng viên. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2}>Quản lý giảng viên</Title>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo mã, tên, bộ môn, khoa..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={handleSearch}
            allowClear
          />
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (availableUsers.length === 0) {
                Modal.warning({
                  title: 'Thông báo',
                  content: 'Không còn tài khoản giảng viên nào chưa được gán. Vui lòng tạo tài khoản mới trước.'
                });
                return;
              }
              setEditingId(null);
              form.resetFields();
              form.setFieldsValue({
                trangThai: 1
              });
              setIsModalVisible(true);
            }}
          >
            Thêm giảng viên
          </Button>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setIsImportModalVisible(true)}
          >
            Import Excel
          </Button>
          <Button 
            icon={<BarChartOutlined />}
            onClick={calculateStats}
          >
            Thống kê
          </Button>
        </Space>
      </div>

      <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giảng viên`,
            showSizeChanger: true,
            showQuickJumper: true
          }}
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
        title="Thống kê giảng viên"
        open={isStatsModalVisible}
        onCancel={() => setIsStatsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsStatsModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Statistic 
              title="Tổng số giảng viên" 
              value={statsData.total} 
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              prefix={<PieChartOutlined />}
            />
          </Col>
        </Row>
        
        <Divider>Theo trình độ</Divider>
        <List
          bordered
          dataSource={Object.entries(statsData.byLevel)}
          renderItem={([level, count]) => (
            <List.Item>
              <Badge color={getColorForLevel(level)} text={level} /> 
              <span style={{ marginLeft: 'auto' }}>{count} giảng viên</span>
            </List.Item>
          )}
        />
        
        <Divider>Theo vai trò</Divider>
        <List
          bordered
          dataSource={[
            ['Trưởng khoa', statsData.roles.truongKhoa],
            ['Giảng viên', statsData.roles.giangVien]
          ]}
          renderItem={([role, count]) => (
            <List.Item>
              <Badge color={role === 'Trưởng khoa' ? '#f5222d' : '#52c41a'} text={role} /> 
              <span style={{ marginLeft: 'auto' }}>{count} người</span>
            </List.Item>
          )}
        />
        
        <Divider>Theo khoa</Divider>
        <List
          bordered
          dataSource={Object.entries(statsData.byFaculty)}
          renderItem={([faculty, count]) => (
            <List.Item>
              <span>{faculty}</span>
              <span style={{ marginLeft: 'auto' }}>{count} giảng viên</span>
            </List.Item>
          )}
        />
        
        <Divider>Theo trạng thái tài khoản</Divider>
        <List
          bordered
          dataSource={[
            ['Đã liên kết tài khoản', statsData.userStatus.linked],
            ['Chưa liên kết tài khoản', statsData.userStatus.notLinked]
          ]}
          renderItem={([status, count]) => (
            <List.Item>
              <Badge color={status === 'Đã liên kết tài khoản' ? '#52c41a' : '#faad14'} text={status} /> 
              <span style={{ marginLeft: 'auto' }}>{count} giảng viên</span>
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title={editingId ? "Sửa thông tin giảng viên" : "Thêm giảng viên mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        maskClosable={false}
        width={600}
      >
        {renderForm()}
      </Modal>

      <Modal
        title="Import danh sách giảng viên"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>Hướng dẫn:</Title>
          <p>File Excel cần có các cột sau:</p>
          <ul>
            <li>họ tên (bắt buộc)</li>
            <li>bộ môn (bắt buộc)</li>
            <li>khoa (bắt buộc)</li>
            <li>trình độ (bắt buộc, chấp nhận: Thạc sĩ, Tiến sĩ, Phó Giáo sư, Giáo sư)</li>
            <li>chuyên môn (bắt buộc)</li>
          </ul>
        </div>
        
        <Upload.Dragger
          accept=".xlsx,.xls"
          beforeUpload={handleImport}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Nhấp chuột hoặc kéo thả file vào đây</p>
          <p className="ant-upload-hint">
            Chỉ hỗ trợ file Excel (.xlsx, .xls)
          </p>
        </Upload.Dragger>
      </Modal>
    </Card>
  );
};

// Helper function to generate colors for education levels
const getColorForLevel = (level) => {
  const colorMap = {
    'Thạc sĩ': '#722ed1',
    'Tiến sĩ': '#1890ff',
    'Phó Giáo sư': '#52c41a',
    'Giáo sư': '#faad14',
    'Không xác định': '#bfbfbf'
  };
  
  return colorMap[level] || '#bfbfbf';
};

export default ManageLecturer;