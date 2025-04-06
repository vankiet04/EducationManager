package com.example.net.guides.springboot.controller;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.dto.DTO_Role;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userService.findUserByUsername(userDto.getUsername()) != null) {
                return new ResponseEntity<>(Map.of("message", "Username đã tồn tại!"), 
                                           HttpStatus.BAD_REQUEST);
            }
            
            if (userDto.getRoles() == null || userDto.getRoles().isEmpty()) {
                List<DTO_Role> roles = new ArrayList<>();
                DTO_Role userRole = new DTO_Role();
                userRole.setName("ROLE_USER");
                roles.add(userRole);
                userDto.setRoles(roles);
            }
            
            userService.saveUser(userDto);
            
            return new ResponseEntity<>(Map.of("message", "Đăng ký thành công!"), 
                                      HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Đăng ký thất bại: " + e.getMessage()), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(Map.of("exists", user != null), HttpStatus.OK);
    }
}