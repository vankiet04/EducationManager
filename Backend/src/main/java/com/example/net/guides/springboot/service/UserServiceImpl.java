package com.example.net.guides.springboot.service;

import com.example.net.guides.springboot.dto.UserDto;
import com.example.net.guides.springboot.entity.Role;
import com.example.net.guides.springboot.entity.User;
import com.example.net.guides.springboot.repository.RoleRepository;
import com.example.net.guides.springboot.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void saveUser(UserDto userDto) {
        try {
            User user = new User();
            user.setName(userDto.getFirstName() + " " + userDto.getLastName());
            // Thêm username (dùng email làm username hoặc kết hợp firstName+lastName)
            user.setUsername(userDto.getEmail());
            user.setEmail(userDto.getEmail());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));

            // Sửa đoạn code lỗi với Set<Role>
            Role role = checkRoleExist();
            user.setRoles(Collections.singleton(role));

            userRepository.save(user);
            System.out.println("User saved successfully: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            throw e; 
        }
    }

    @Override
    public List<UserDto> findAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map((user) -> mapToUserDto(user))
                .collect(Collectors.toList());
    }

    private UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId()); 
        String[] str = user.getName().split(" ");
        userDto.setFirstName(str[0]);
        userDto.setLastName(str[1]);
        userDto.setEmail(user.getEmail());
        return userDto;
    }

    private Role checkRoleExist() {
        Role role = roleRepository.findByName("ROLE_ADMIN").orElse(null);
        
        if (role == null) {
            role = new Role();
            role.setName("ROLE_ADMIN");
            role = roleRepository.save(role);
        }
        
        return role;
    }

    @Override
    public User findUserByEmail(String email) {
        // TODO Auto-generated method stub
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        try {
            User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                user.setRoles(Collections.emptySet());
                userRepository.save(user);
                userRepository.deleteById(id);
                System.out.println("User with ID " + id + " was deleted successfully");
            }
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            throw e;
        }
    }

    
}