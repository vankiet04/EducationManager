package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.repository.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }
    
    @Override
    public Optional<Role> findRoleById(Long id) {
        return roleRepository.findById(id);
    }
    
    @Override
    public Optional<Role> findRoleByName(String name) {
        return roleRepository.findByName(name);
    }
    
    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }
} 