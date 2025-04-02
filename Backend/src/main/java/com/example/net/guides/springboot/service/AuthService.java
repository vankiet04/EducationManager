package com.example.net.guides.springboot.service;

import com.example.net.guides.springboot.dto.LoginDto;

public interface AuthService {
    String login(LoginDto loginDto);
}
