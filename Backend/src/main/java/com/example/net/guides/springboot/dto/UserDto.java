package com.example.net.guides.springboot.dto;

import java.util.ArrayList;
import java.util.List;

public class UserDto {

    private String username;

    private String password;
    
    private String hoTen;
    
    private String email;
    
    private String soDienThoai;
    
    private List<DTO_Role> roles = new ArrayList<>();
    
    private Integer namSinh;

    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getHoTen() {
        return hoTen;
    }
    
    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getSoDienThoai() {
        return soDienThoai;
    }
    
    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public List<DTO_Role> getRoles() {
        return roles;
    }

    public void setRoles(List<DTO_Role> roles) {
        this.roles = roles;
    }

    public Integer getNamSinh() {
        return namSinh;
    }

    public void setNamSinh(Integer namSinh) {
        this.namSinh = namSinh;
    }
}