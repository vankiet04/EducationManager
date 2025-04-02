package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.net.guides.springboot.dto.JWTAuthResponse;
import com.example.net.guides.springboot.dto.LoginDto;
import com.example.net.guides.springboot.dto.SignUpDto;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.entity.Role;
import com.example.net.guides.springboot.entity.User;
import com.example.net.guides.springboot.repository.RoleRepository;
import com.example.net.guides.springboot.repository.UserRepository;
import com.example.net.guides.springboot.service.AuthService;
import com.example.net.guides.springboot.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
        @Autowired
        private AuthService authService;

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private RoleRepository roleRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

       
        @PostMapping("/login")
        public ResponseEntity<JWTAuthResponse> authenticate(@RequestBody LoginDto loginDto) {
                String token = authService.login(loginDto);

                JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
                jwtAuthResponse.setAccessToken(token);

                return ResponseEntity.ok(jwtAuthResponse);
        }
        
        @PostMapping("/signin")
        public ResponseEntity<String> authenticateUser(@RequestBody LoginDto loginDto) {
                Authentication authentication = authenticationManager
                                .authenticate(new UsernamePasswordAuthenticationToken(
                                                loginDto.getUsernameOrEmail(), loginDto.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                return new ResponseEntity<>("User signed-in successfully!.", HttpStatus.OK);
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@RequestBody SignUpDto signUpDto) {
                if (userRepository.existsByUsername(signUpDto.getUsername())) {
                        return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
                }
                if (userRepository.existsByEmail(signUpDto.getEmail())) {
                        return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
                }

                User user = new User();
                user.setName(signUpDto.getName());
                user.setUsername(signUpDto.getUsername());
                user.setEmail(signUpDto.getEmail());
                user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
                Role roles = roleRepository.findByName("ROLE_ADMIN").get();
                user.setRoles(Collections.singleton(roles));
                userRepository.save(user);
                return new ResponseEntity<>("User registered successfully", HttpStatus.OK);

        }

}