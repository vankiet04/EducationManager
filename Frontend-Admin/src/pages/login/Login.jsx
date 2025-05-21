import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import UniversityImage from "../../images/common/daihocsaigon.jpg";
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import CheckBox from '../../components/common/CheckBox.jsx';
import {login} from '../../store/slices/authenticationSlice.jsx';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isRemember, setIsRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleInputChange = (fieldName, newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));
  };

  const handleRememberChange = (check) => {
    setIsRemember(check);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if ((formData.username === "admin" && formData.password === "admin") || 
        (formData.username === "admin2" && formData.password === "123456")) {
      dispatch(login());
      navigate('/');
    } else {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 5000);
    }
  };

  return (
    <div className="login" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left side - Login Form */}      <div className="login_form" style={{ flex: '1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="login_content" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 className="page_heading" style={{ fontSize: '28px', fontWeight: '600', color: '#1890ff' } }>EduManager Login</h2>
        </div>
        <form className="form" onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          <div className="form_control" style={{ marginBottom: '20px' }}>
            <Input
              type="text"
              value={formData.username}
              onChange={(value) => handleInputChange("username", value)}
              placeholder="Username"
              icon={<Icons.TbUser/>}
              label="Username"
            />
          </div>
          <div className="form_control" style={{ marginBottom: '20px' }}>
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              placeholder="Password"
              label="Password"
              onClick={handleShowPassword}
              icon={<Icons.TbEye/>}
            />
          </div>
          <div className="form_control" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CheckBox
              id="rememberCheckbox"
              label="Remember me"
              checked={isRemember}
              onChange={handleRememberChange}
            />
            <Link to="#" style={{ color: '#1163d7', fontSize: '14px', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          {loginError && <div className="incorrect" style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>Sai tài khoản hoặc mật khẩu</div>}
          <div className="form_control">
            <Button
              label="Login"
              type="submit"
              style={{ width: '100%', padding: '12px', backgroundColor: '#1163d7' }}
            />
          </div>
        </form>
        <p className="login_footer" style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#666' }}>
          © 2025 EduManager - Hệ thống quản lý đào tạo
        </p>
      </div>
      
      {/* Right side - University Image */}
      <div className="login_image_container" style={{ flex: '1', position: 'relative' }}>
        <img 
          src={UniversityImage} 
          alt="Trường Đại học Sài Gòn" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: 'center'
          }} 
        />
      </div>
    </div>
  );
}

export default Login;