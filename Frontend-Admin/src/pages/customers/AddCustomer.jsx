import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import axios from "axios";
import { notification } from "antd";

const AddCustomer = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [fields, setFields] = useState({
    username: "",
    hoTen: "",
    email: "",
    soDienThoai: "",
    namSinh: "",
    password: "",
    passwordConfirm: "",
    trangThai: "active",
    image: "",
  });

  useEffect(() => {
    // Fetch roles from backend
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách vai trò'
      });
    }
  };

  const handleInputChange = (key, value) => {
    setFields({
      ...fields,
      [key]: value,
    });
  };

  const handleStatusSelect = (isSelect) => {
    setFields({
      ...fields,
      trangThai: isSelect.label,
    });
  };

  const handleRoleSelect = (roleId) => {
    const isSelected = selectedRoles.includes(roleId);
    if (isSelected) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!fields.username || !fields.hoTen || !fields.email || !fields.password) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc (tên đăng nhập, họ tên, email, mật khẩu)'
      });
      return;
    }

    if (fields.password !== fields.passwordConfirm) {
      notification.error({
        message: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp'
      });
      return;
    }

    if (selectedRoles.length === 0) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn ít nhất một vai trò cho người dùng'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create a proper UserDto object
      const userData = {
        username: fields.username,
        password: fields.password,
        hoTen: fields.hoTen,
        email: fields.email,
        soDienThoai: fields.soDienThoai,
        namSinh: fields.namSinh ? parseInt(fields.namSinh) : null,
        trangThai: fields.trangThai === 'active',
        roleIds: selectedRoles,
        vai_tro: selectedRoles.length > 0 ? selectedRoles[0] : null // Set vai_tro using the first selected role
      };
      
      // Add new user
      const response = await axios.post('http://localhost:8080/api/user/register', userData);
      
      notification.success({
        message: 'Thành công',
        description: 'Thêm người dùng mới thành công!'
      });
      
      // Reset form
      setFields({
        username: "",
        hoTen: "",
        email: "",
        soDienThoai: "",
        namSinh: "",
        password: "",
        passwordConfirm: "",
        trangThai: "active",
        image: "",
      });
      setSelectedRoles([]);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show detailed error message
      notification.error({
        message: 'Lỗi',
        description: `Không thể lưu thông tin người dùng: ${error.response?.data?.message || error.message}`
      });
      
    } finally {
      setLoading(false);
    }
  };

  const [status, setStatus] = useState([
    {
      value: "active",
      label: "active",
    },
    {
      value: "locked",
      label: "locked",
    },
  ]);

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Chi tiết người dùng</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  label="Tên đăng nhập"
                  icon={<Icons.TbUser />}
                  value={fields.username}
                  onChange={(value) => handleInputChange("username", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Nhập họ và tên"
                  label="Họ và tên"
                  icon={<Icons.TbUser />}
                  value={fields.hoTen}
                  onChange={(value) => handleInputChange("hoTen", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Nhập email"
                  label="Email"
                  icon={<Icons.TbMail />}
                  value={fields.email}
                  onChange={(value) => handleInputChange("email", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  label="Số điện thoại"
                  icon={<Icons.TbPhone />}
                  value={fields.soDienThoai}
                  onChange={(value) => handleInputChange("soDienThoai", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="number"
                  placeholder="Nhập năm sinh"
                  label="Năm sinh"
                  icon={<Icons.TbCalendar />}
                  value={fields.namSinh}
                  onChange={(value) => handleInputChange("namSinh", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  label="Mật khẩu"
                  icon={<Icons.TbLock />}
                  value={fields.password}
                  onChange={(value) => handleInputChange("password", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  label="Xác nhận mật khẩu"
                  icon={<Icons.TbLockCheck />}
                  value={fields.passwordConfirm}
                  onChange={(value) => handleInputChange("passwordConfirm", value)}
                />
              </div>
              <div className="column">
                <h3>Vai trò</h3>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px'}}>
                  {roles.map(role => (
                    <div key={role.id} style={{
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      backgroundColor: selectedRoles.includes(role.id) ? '#1890ff' : 'transparent',
                      color: selectedRoles.includes(role.id) ? 'white' : 'inherit'
                    }} onClick={() => handleRoleSelect(role.id)}>
                      {role.name}
                    </div>
                  ))}
                </div>
                {selectedRoles.length === 0 && (
                  <div style={{color: 'red', marginTop: '5px', fontSize: '12px'}}>
                    Vui lòng chọn ít nhất một vai trò
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Lưu</h2>
              <Button
                label={loading ? "Đang lưu..." : "Lưu & thoát"}
                icon={<Icons.TbDeviceFloppy />}
                className=""
                onClick={handleSubmit}
                disabled={loading}
              />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Trạng thái</h2>
              <div className="column">
                <Dropdown
                  placeholder="Chọn trạng thái"
                  selectedValue={fields.trangThai}
                  onClick={handleStatusSelect}
                  options={status}
                />
              </div>
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Ảnh đại diện</h2>
              <div className="column">
                <Thumbnail
                  preloadedImage={fields.image}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddCustomer