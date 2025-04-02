package com.example.net.guides.springboot.service;

import java.util.List;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.entity.User;

public interface UserService {
    void saveUser(UserDto userDto);

    User findUserByEmail(String email);

    List<UserDto> findAllUsers();

    void deleteUser(Long id);
}