package com.example.net.guides.springboot.controller;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.RoleDto;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.service.RoleService;
import com.example.net.guides.springboot.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleService roleService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User savedUser = userService.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Thêm người dùng thất bại: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.findUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Người dùng không tồn tại"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        try {
            User updatedUser = userService.updateUser(id, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Cập nhật người dùng thất bại: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "Vô hiệu hóa người dùng thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Vô hiệu hóa người dùng thất bại: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userService.findUserByUsername(userDto.getUsername()) != null) {
                return new ResponseEntity<>(Map.of("message", "Username đã tồn tại!"), 
                                           HttpStatus.BAD_REQUEST);
            }
            
            if (userDto.getEmail() != null && !userService.isEmailUnique(userDto.getEmail())) {
                return new ResponseEntity<>(Map.of("message", "Email đã được sử dụng bởi tài khoản khác!"), 
                                           HttpStatus.BAD_REQUEST);
            }
            
            userService.saveUser(userDto);
            
            return new ResponseEntity<>(Map.of("message", "Đăng ký thành công!"), 
                                      HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), 
                                      HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Đăng ký thất bại: " + e.getMessage()), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{userId}/is-lecturer")
    public ResponseEntity<Map<String, Boolean>> checkIfUserIsLecturer(@PathVariable Integer userId) {
        boolean isLecturer = userService.isUserLecturer(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isLecturer", isLecturer);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{userId}/roles")
    public ResponseEntity<?> getUserRoles(@PathVariable Integer userId) {
        Optional<User> userOpt = userService.findUserById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<RoleDto> roles = user.getRoles().stream()
                .map(role -> new RoleDto(role.getId(), role.getName()))
                .collect(Collectors.toList());
            return ResponseEntity.ok(roles);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Người dùng không tồn tại"));
        }
    }
    
    @PostMapping("/{userId}/roles")
    public ResponseEntity<?> addRolesToUser(@PathVariable Integer userId, @RequestBody Set<Long> roleIds) {
        try {
            Optional<User> userOpt = userService.findUserById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại"));
            }
            
            User user = userOpt.get();
            Set<Role> rolesToAdd = new HashSet<>();
            
            for (Long roleId : roleIds) {
                Optional<Role> roleOpt = roleService.findRoleById(roleId);
                if (roleOpt.isPresent()) {
                    rolesToAdd.add(roleOpt.get());
                }
            }
            
            // Add all new roles
            user.getRoles().addAll(rolesToAdd);
            userService.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Thêm vai trò thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Thêm vai trò thất bại: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<?> removeRoleFromUser(@PathVariable Integer userId, @PathVariable Long roleId) {
        try {
            Optional<User> userOpt = userService.findUserById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại"));
            }
            
            Optional<Role> roleOpt = roleService.findRoleById(roleId);
            if (!roleOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Vai trò không tồn tại"));
            }
            
            User user = userOpt.get();
            Role role = roleOpt.get();
            
            user.removeRole(role);
            userService.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Xóa vai trò thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Xóa vai trò thất bại: " + e.getMessage()));
        }
    }
} 