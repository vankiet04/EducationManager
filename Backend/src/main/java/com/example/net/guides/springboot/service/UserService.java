package com.example.net.guides.springboot.service;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.User;

public interface UserService {
    void saveUser(UserDto userDto);
    User findUserByUsername(String username);
    User save(User user);
}