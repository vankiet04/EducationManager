package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import com.example.net.guides.springboot.model.Role;

public interface RoleService {
    List<Role> findAllRoles();
    Optional<Role> findRoleById(Long id);
    Optional<Role> findRoleByName(String name);
    Role saveRole(Role role);
} 