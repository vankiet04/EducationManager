package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.repository.GiangVienRepository;
import com.example.net.guides.springboot.repository.RoleRepository;
import com.example.net.guides.springboot.repository.UserRepository;
import com.example.net.guides.springboot.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GiangVienRepository giangVienRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void saveUser(UserDto userDto) {
        // Validate email uniqueness
        if (!isEmailUnique(userDto.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác!");
        }
        
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setHoTen(userDto.getHoTen());
        user.setEmail(userDto.getEmail());
        user.setSoDienThoai(userDto.getSoDienThoai());
        user.setNamSinh(userDto.getNamSinh());
        user.setTrangThai(true); // Default to active
        
        // Set roles if provided
        if (userDto.getRoleIds() != null && !userDto.getRoleIds().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : userDto.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role không tìm thấy với ID: " + roleId));
                roles.add(role);
            }
            user.setRoles(roles);
            
            // Also set vai_tro field with the first role ID for backward compatibility
            Long firstRoleId = userDto.getRoleIds().iterator().next();
            user.setVaiTro(firstRoleId.toString());
        } 
        // If vai_tro is provided but no roleIds, use it to set a role
        else if (userDto.getVaiTro() != null && !userDto.getVaiTro().isEmpty()) {
            user.setVaiTro(userDto.getVaiTro());
            
            try {
                Long roleId = Long.parseLong(userDto.getVaiTro());
                
                // Also update the roles collection
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role không tìm thấy với ID: " + roleId));
                
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                user.setRoles(roles);
            } catch (NumberFormatException e) {
                // If vai_tro is not a valid number, set default role
                roleRepository.findById(1L).ifPresent(user::addRole);
            }
        } else {
            // Default role if none provided (using ID 1 which is 'giangvien' role)
            roleRepository.findById(1L).ifPresent(user::addRole);
            user.setVaiTro("1"); // Set default vai_tro as "1" (giangvien)
        }

        userRepository.save(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User save(User user) {
        // Validate email uniqueness for new user
        if (user.getId() == null) {
            if (!isEmailUnique(user.getEmail())) {
                throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác!");
            }
        } else {
            if (!isEmailUniqueForUpdate(user.getEmail(), user.getId())) {
                throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác!");
            }
        }
        
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
        
        // Check for 'giangvien' role in the roles collection
        boolean hasLecturerRole = user.getRoles().stream()
                .anyMatch(role -> "giangvien".equals(role.getName()));
        
        if (!hasLecturerRole) {
            // Fallback to check old vaiTro field
            hasLecturerRole = "GIANG_VIEN".equals(user.getVaiTro());
        }
                
        // Check if user is associated with a GiangVien entity
        GiangVien giangVien = giangVienRepository.findByUserId(userId);
        
        return hasLecturerRole && giangVien != null;
    }
    
    @Override
    @Transactional
    public User updateUser(Integer userId, UserDto userDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tìm thấy với ID: " + userId));
        
        // Validate email uniqueness for update
        if (userDto.getEmail() != null && !userDto.getEmail().equals(existingUser.getEmail())) {
            if (!isEmailUniqueForUpdate(userDto.getEmail(), userId)) {
                throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác!");
            }
        }
        
        // Update basic user info
        existingUser.setHoTen(userDto.getHoTen());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setSoDienThoai(userDto.getSoDienThoai());
        existingUser.setNamSinh(userDto.getNamSinh());
        
        // Update password if provided
        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        
        // Update trang_thai if provided
        if (userDto.getTrangThai() != null) {
            existingUser.setTrangThai(userDto.getTrangThai());
        }
        
        // Update roles if provided
        if (userDto.getRoleIds() != null && !userDto.getRoleIds().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : userDto.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role không tìm thấy với ID: " + roleId));
                roles.add(role);
            }
            existingUser.setRoles(roles);
            
            // Also update the vai_tro field with the first role ID for backward compatibility
            Long firstRoleId = userDto.getRoleIds().iterator().next();
            existingUser.setVaiTro(firstRoleId.toString());
        }
        // If vai_tro is provided but no roleIds, use it to set a role
        else if (userDto.getVaiTro() != null && !userDto.getVaiTro().isEmpty()) {
            try {
                Long roleId = Long.parseLong(userDto.getVaiTro());
                existingUser.setVaiTro(userDto.getVaiTro());
                
                // Also update the roles collection
                Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role không tìm thấy với ID: " + roleId));
                
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                existingUser.setRoles(roles);
            } catch (NumberFormatException e) {
                // If vai_tro is not a valid number, just set it without updating roles
                existingUser.setVaiTro(userDto.getVaiTro());
            }
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
        
        // Soft delete: update trang_thai to false (0) instead of deleting
        user.setTrangThai(false);
        userRepository.save(user);
    }
    
    @Override
    public boolean isEmailUnique(String email) {
        return !userRepository.existsByEmail(email);
    }
    
    @Override
    public boolean isEmailUniqueForUpdate(String email, Integer userId) {
        return !userRepository.existsByEmailAndIdNot(email, userId);
    }
}