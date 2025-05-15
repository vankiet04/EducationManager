package com.example.net.guides.springboot.controller;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthRestController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userService.findUserByUsername(userDto.getUsername()) != null) {
                return new ResponseEntity<>(Map.of("message", "Username đã tồn tại!"), 
                                           HttpStatus.BAD_REQUEST);
            }
            
            // Set default role if not provided
            if (userDto.getVaiTro() == null || userDto.getVaiTro().isEmpty()) {
                userDto.setVaiTro("NGUOI_DUNG");
            }
            
            userService.saveUser(userDto);
            
            return new ResponseEntity<>(Map.of("message", "Đăng ký thành công!"), 
                                      HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Đăng ký thất bại: " + e.getMessage()), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Get the user details
            User user = userService.findUserByUsername(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("hoTen", user.getHoTen());
            response.put("email", user.getEmail());
            response.put("vaiTro", user.getVaiTro());
            response.put("message", "Đăng nhập thành công!");
            
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Thông tin đăng nhập không chính xác!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Đăng nhập thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        User user = userService.findUserByUsername(username);
        return new ResponseEntity<>(Map.of("exists", user != null), HttpStatus.OK);
    }
}