import * as Icons from "react-icons/tb";
import Orders from '../../api/Orders.json';
import Reviews from '../../api/Reviews.json';
import country from '../../api/country.json';
import {useParams, Link, useNavigate} from 'react-router-dom'
import Customers from '../../api/Customers.json';
import React, { useState, useEffect } from "react";
import Modal from "../../components/common/Modal.jsx";
import Badge from "../../components/common/Badge.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import Rating from "../../components/common/Rating.jsx";
import Divider from "../../components/common/Divider.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Offcanvas from "../../components/common/Offcanvas.jsx";
import Thumbnail from "../../components/common/Thumbnail.jsx";
import Accordion from "../../components/common/Accordion.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import MultiSelect from "../../components/common/MultiSelect.jsx";
import axios from "axios";
import { notification } from "antd";

const EditCustomer = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const customer = Customers.find(customer => customer.id.toString() === customerId.toString());

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
    addressName:"",
    addressPhone:"",
    addressZip:"",
    addressEmail:"",
    addressStreet:"",
    addressCountry:"",
    addressState:"",
    addressCity:"",
  });

  useEffect(() => {
    // Fetch roles and user data
    fetchRoles();
    fetchUserData();
  }, [customerId]);

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

  const fetchUserData = async () => {
    try {
      setLoadingUser(true);
      const response = await axios.get(`http://localhost:8080/api/user/${customerId}`);
      const userData = response.data;
      
      // Fetch user roles
      let userRoles = [];
      try {
        const rolesResponse = await axios.get(`http://localhost:8080/api/user/${customerId}/roles`);
        userRoles = rolesResponse.data;
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
      
      setFields({
        username: userData.username || "",
        hoTen: userData.hoTen || "",
        email: userData.email || "",
        soDienThoai: userData.soDienThoai || "",
        namSinh: userData.namSinh?.toString() || "",
        password: "",
        passwordConfirm: "",
        trangThai: userData.trangThai ? "active" : "locked",
        image: userData.image || "",
        addressName: "",
        addressPhone: "",
        addressZip: "",
        addressEmail: "",
        addressStreet: "",
        addressCountry: "",
        addressState: "",
        addressCity: "",
      });
      
      // Set selected role (the first one if multiple exist)
      if (userRoles.length > 0) {
        setSelectedRole(userRoles[0].id);
      }
      
      setLoadingUser(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin người dùng'
      });
      setLoadingUser(false);
      navigate('/customers/manage');
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
    setSelectedRole(roleId);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!fields.hoTen || !fields.email) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc (họ tên, email)'
      });
      return;
    }

    if (fields.password && fields.password !== fields.passwordConfirm) {
      notification.error({
        message: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp'
      });
      return;
    }

    if (!selectedRole) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn vai trò cho người dùng'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create a proper UserDto object
      const userData = {
        hoTen: fields.hoTen,
        email: fields.email,
        soDienThoai: fields.soDienThoai,
        namSinh: fields.namSinh ? parseInt(fields.namSinh) : null,
        trangThai: fields.trangThai === 'active',
        roleIds: [selectedRole], // Send the role ID as an array for the roles collection
        vai_tro: selectedRole // Set vai_tro directly as a number (not string)
      };
      
      // Add password only if changed
      if (fields.password) {
        userData.password = fields.password;
      }
      
      // Update user
      await axios.put(`http://localhost:8080/api/user/${customerId}`, userData);
      
      notification.success({
        message: 'Thành công',
        description: 'Cập nhật người dùng thành công!'
      });
      
      // Refresh user data
      fetchUserData();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show detailed error message
      notification.error({
        message: 'Lỗi',
        description: `Không thể cập nhật thông tin người dùng: ${error.response?.data?.message || error.message}`
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

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleOpenOffcanvas = () => {
    setIsOffcanvasOpen(true);
  };

  const handleCloseOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const handleCountrySelect = (country) => {
    setFields({
      ...fields,
      addressCountry: country.label,
    });
  };

   const actionItems = ["Delete", "View"];

  const handleActionItemClick = (item, itemID) => {
    var updateItem = item.toLowerCase();
    if (updateItem === "delete") {
      alert(`#${itemID} item delete`);
    } else if (updateItem === "view") {
      navigate(`/catalog/product/manage/${itemID}`);
    }
  };
  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item">
              <h2 className="sub_heading">Chi tiết người dùng {loadingUser ? "(Đang tải...)" : ""}</h2>
              <div className="column">
                <Input
                  type="text"
                  placeholder="Tên đăng nhập"
                  label="Tên đăng nhập"
                  icon={<Icons.TbUser />}
                  value={fields.username}
                  onChange={(value) => handleInputChange("username", value)}
                  disabled={true}
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
                  placeholder="Nhập mật khẩu mới (để trống nếu không thay đổi)"
                  label="Mật khẩu"
                  icon={<Icons.TbLock />}
                  value={fields.password}
                  onChange={(value) => handleInputChange("password", value)}
                />
              </div>
              <div className="column">
                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  label="Xác nhận mật khẩu"
                  icon={<Icons.TbLockCheck />}
                  value={fields.passwordConfirm}
                  onChange={(value) => handleInputChange("passwordConfirm", value)}
                />
              </div>
              <div className="column">
                <h3>Vai trò</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                  {roles.map(role => (
                    <div key={role.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      backgroundColor: selectedRole === role.id ? '#1890ff' : 'transparent',
                      color: selectedRole === role.id ? 'white' : 'inherit'
                    }} onClick={() => handleRoleSelect(role.id)}>
                      <input 
                        type="radio" 
                        name="role" 
                        checked={selectedRole === role.id} 
                        onChange={() => handleRoleSelect(role.id)}
                      />
                      <span>{role.name}</span>
                    </div>
                  ))}
                </div>
                {!selectedRole && (
                  <div style={{color: 'red', marginTop: '5px', fontSize: '12px'}}>
                    Vui lòng chọn vai trò cho người dùng
                  </div>
                )}
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Addresses</span>
                <Button
                  className="sm"
                  label="new address"
                  icon={<Icons.TbPlus/>}
                  onClick={handleOpenOffcanvas}
                />
              </h2>
              <Offcanvas isOpen={isOffcanvasOpen} onClose={handleCloseOffcanvas} className="lg">
                <div className="offcanvas-head">
                  <h2>add address</h2>
                </div>
                <div className="offcanvas-body">
                  <div className="content_item">
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address name"
                        label="Address Name"
                        className="sm"
                        value={fields.addressName}
                        onChange={(value) => handleInputChange("addressName", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="tel"
                        placeholder="Address Phone"
                        label="Address Phone"
                        className="sm"
                        value={fields.addressPhone}
                        onChange={(value) => handleInputChange("addressPhone", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="number"
                        placeholder="Zip code"
                        label="Zip code"
                        className="sm"
                        value={fields.addressZip}
                        onChange={(value) => handleInputChange("addressZip", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="email"
                        placeholder="Address Email"
                        label="Address Email"
                        className="sm"
                        value={fields.addressEmail}
                        onChange={(value) => handleInputChange("addressEmail", value)}
                      />
                    </div>
                    <div className="column">
                      <Input
                        type="text"
                        placeholder="Address Street"
                        label="Address Street"
                        className="sm"
                        value={fields.addressStreet}
                        onChange={(value) => handleInputChange("addressStreet", value)}
                      />
                    </div>
                    <div className="column">
                      
                      <MultiSelect
                        placeholder="Select Country"
                        isSelected={fields.addressCountry}
                        onClick={handleCountrySelect}
                        options={country}
                        className="sm"
                        isMulti={false}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address State"
                        label="Address State"
                        className="sm"
                        value={fields.addressState}
                        onChange={(value) => handleInputChange("addressState", value)}
                      />
                    </div>
                    <div className="column_3">
                      <Input
                        type="text"
                        placeholder="Address City"
                        label="Address City"
                        className="sm"
                        value={fields.addressCity}
                        onChange={(value) => handleInputChange("addressCity", value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="offcanvas-footer">
                  <Button
                    label="discard"
                    onClick={handleCloseOffcanvas}
                    className="outline"
                  />
                  <Button
                    label="Add"
                    onClick={handleCloseOffcanvas}
                  />
                </div>
              </Offcanvas>
              {
                customer.addresses.map((address, key)=>(
                  <div className="column" key={key}>
                    <Accordion title={`#${key < 9 ? `0${key+1}` : key+1} Address`}>
                      <table className="bordered">
                        <thead>
                          <tr>
                            <th>Street</th>
                            <th>city</th>
                            <th>State</th>
                            <th>zip code</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{address.street}</td>
                            <td>{address.city}</td>
                            <td>{address.state}</td>
                            <td>{address.zip}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Accordion>
                  </div>
                ))
              }
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Payments</h2>
              <div className="column">
                <div className="table_responsive">
                  <table className="bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Transaction ID</th>
                        <th>Payment Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Orders.map((order, key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <Link to={`/orders/manage/${order.id.toString()}`}>#{order.id}<Icons.TbExternalLink/></Link>
                          </td>
                          <td>{order.payment_details.transaction_id}</td>
                          <td>{order.payment_details.payment_method}</td>
                          <td>{order.payment_details.amount}</td>
                          <td className="td_status">
                              {order.status.toLowerCase() === "active" ||
                               order.status.toLowerCase() === "completed" ||
                               order.status.toLowerCase() === "delivered" ||
                               order.status.toLowerCase() === "shipped" ||
                               order.status.toLowerCase() === "new" ||
                               order.status.toLowerCase() === "coming soon" ? (
                                 <Badge
                                   label={order.status}
                                   className="light-success"
                                 />
                               ) : order.status.toLowerCase() === "inactive" ||
                                 order.status.toLowerCase() === "out of stock" ||
                                 order.status.toLowerCase() === "locked" ||
                                 order.status.toLowerCase() === "discontinued" ? (
                                 <Badge
                                   label={order.status}
                                   className="light-danger"
                                 />
                               ) : order.status.toLowerCase() === "on sale" ||
                                   order.status.toLowerCase() === "featured" ||
                                   order.status.toLowerCase() === "processing" ||
                                   order.status.toLowerCase() === "pending" ? (
                                 <Badge
                                   label={order.status}
                                   className="light-warning"
                                 />
                               ) : order.status.toLowerCase() === "archive" ||
                                   order.status.toLowerCase() === "pause" ? (
                                 <Badge
                                   label={order.status}
                                   className="light-secondary"
                                 />
                               ) : (
                                 "nodata"
                               )}
                            </td>
                          
                          <td className="td_action">
                            <TableAction
                              actionItems={actionItems}
                              onActionItemClick={(item) =>
                                handleActionItemClick(item, customer.id)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">reviews</h2>
              <div className="column">
                <table className="bordered">
                  <thead>
                    <tr>
                      <th className="td_id">ID</th>
                      <th>Product ID</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Review Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Reviews.map(review => (
                      <tr key={review.review_id}>
                        <td className="td_id">#{review.review_id}</td>
                        <td>{review.product_id}</td>
                        <td>
                          <Rating value={review.rating}/>
                        </td>
                        <td className="td_review"><p>{review.review_text}</p></td>
                        <td>{review.review_date}</td>
                        <td className="td_status">
                          {review.status.toLowerCase() === "active" ||
                           review.status.toLowerCase() === "completed" ||
                           review.status.toLowerCase() === "approved" ||
                           review.status.toLowerCase() === "delivered" ||
                           review.status.toLowerCase() === "shipped" ||
                           review.status.toLowerCase() === "new" ||
                           review.status.toLowerCase() === "coming soon" ? (
                             <Badge
                               label={review.status}
                               className="light-success"
                             />
                           ) : review.status.toLowerCase() === "inactive" ||
                             review.status.toLowerCase() === "out of stock" ||
                             review.status.toLowerCase() === "rejected" ||
                             review.status.toLowerCase() === "locked" ||
                             review.status.toLowerCase() === "discontinued" ? (
                             <Badge
                               label={review.status}
                               className="light-danger"
                             />
                           ) : review.status.toLowerCase() === "on sale" ||
                               review.status.toLowerCase() === "featured" ||
                               review.status.toLowerCase() === "processing" ||
                               review.status.toLowerCase() === "pending" ? (
                             <Badge
                               label={review.status}
                               className="light-warning"
                             />
                           ) : review.status.toLowerCase() === "archive" ||
                               review.status.toLowerCase() === "pause" ? (
                             <Badge
                               label={review.status}
                               className="light-secondary"
                             />
                           ) : (
                             review.status
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Lưu</h2>
              <Button
                label={loading ? "Đang lưu..." : "Lưu thay đổi"}
                icon={<Icons.TbDeviceFloppy />}
                className=""
                onClick={handleSubmit}
                disabled={loading || loadingUser}
              />
              <Button
                label="Trở về"
                icon={<Icons.TbArrowLeft />}
                className="secondary"
                onClick={() => navigate('/customers/manage')}
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

export default EditCustomer