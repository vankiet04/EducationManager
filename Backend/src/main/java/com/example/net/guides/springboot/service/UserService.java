package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.User;

public interface UserService {
    void saveUser(UserDto userDto);
    User findUserByUsername(String username);
    User save(User user);
    List<User> findAllUsers();
    
    // Methods for handling lecturer role
    boolean isUserLecturer(Integer userId);
    User updateUser(Integer userId, UserDto userDto);
    Optional<User> findUserById(Integer userId);
    void deleteUser(Integer userId);
}