package com.example.net.guides.springboot.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.RoleDto;
import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.service.RoleService;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin("*")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roleDtos = roleService.findAllRoles().stream()
                .map(role -> new RoleDto(role.getId(), role.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(roleDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        Optional<Role> roleOpt = roleService.findRoleById(id);
        if (roleOpt.isPresent()) {
            Role role = roleOpt.get();
            return ResponseEntity.ok(new RoleDto(role.getId(), role.getName()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Vai trò không tồn tại"));
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody RoleDto roleDto) {
        try {
            Role role = new Role();
            role.setId(roleDto.getId());
            role.setName(roleDto.getName());
            
            Role savedRole = roleService.saveRole(role);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new RoleDto(savedRole.getId(), savedRole.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Tạo vai trò thất bại: " + e.getMessage()));
        }
    }
} 