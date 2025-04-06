package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.dto.DTO_Role;

public interface RoleService {
    void saveRole(DTO_Role role);
    DTO_Role findRoleByName(String name);
    void deleteRole(Long id);
    DTO_Role updateRole(Long id, DTO_Role role);
}
