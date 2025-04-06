package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.repository.UserRepository;
import com.example.net.guides.springboot.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.net.guides.springboot.repository.RoleRepository;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

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
        
        List<Role> roles = new ArrayList<>();
        for (int i = 0; i < userDto.getRoles().size(); i++) {
            String current_role = userDto.getRoles().get(i).getName();
            Role role = roleRepository.findByName(userDto.getRoles().get(i).getName())
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại: " + current_role));
            roles.add(role);
        }

        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}