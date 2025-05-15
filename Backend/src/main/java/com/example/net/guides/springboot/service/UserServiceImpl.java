package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.repository.GiangVienRepository;
import com.example.net.guides.springboot.repository.UserRepository;
import com.example.net.guides.springboot.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GiangVienRepository giangVienRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void saveUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setHoTen(userDto.getHoTen());
        user.setEmail(userDto.getEmail());
        user.setSoDienThoai(userDto.getSoDienThoai());
        user.setNamSinh(userDto.getNamSinh());
        user.setTrangThai(true); // Default to active
        
        // Set vai_tro with default if not provided
        if (userDto.getVaiTro() == null || userDto.getVaiTro().isEmpty()) {
            user.setVaiTro("NGUOI_DUNG"); // Default role
        } else {
            user.setVaiTro(userDto.getVaiTro());
        }

        userRepository.save(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public boolean isUserLecturer(Integer userId) {
        // Check if user has lecturer role
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        boolean hasLecturerRole = "GIANG_VIEN".equals(user.getVaiTro());
                
        // Check if user is associated with a GiangVien entity
        GiangVien giangVien = giangVienRepository.findByUserId(userId);
        
        return hasLecturerRole && giangVien != null;
    }
    
    @Override
    @Transactional
    public User updateUser(Integer userId, UserDto userDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy với ID: " + userId));
        
        // Update basic user info
        existingUser.setHoTen(userDto.getHoTen());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setSoDienThoai(userDto.getSoDienThoai());
        existingUser.setNamSinh(userDto.getNamSinh());
        
        // Update password if provided
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        // Update role if provided
        if (userDto.getVaiTro() != null && !userDto.getVaiTro().isEmpty()) {
            existingUser.setVaiTro(userDto.getVaiTro());
        }
        
        // Update trang_thai if provided
        if (userDto.getTrangThai() != null) {
            existingUser.setTrangThai(userDto.getTrangThai());
        }
        
        return userRepository.save(existingUser);
    }
    
    @Override
    public Optional<User> findUserById(Integer userId) {
        return userRepository.findById(userId);
    }
    
    @Override
    @Transactional
    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy với ID: " + userId));
        
        // Check if user is a lecturer and delete the lecturer record first
        GiangVien giangVien = giangVienRepository.findByUserId(userId);
        if (giangVien != null) {
            giangVienRepository.delete(giangVien);
        }
        
        userRepository.delete(user);
    }
}