package com.example.net.guides.springboot.service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.net.guides.springboot.repository.RoleRepository; 
import com.example.net.guides.springboot.dto.DTO_Role;
import com.example.net.guides.springboot.model.Role;

public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository; 

    @Override
    public void saveRole(DTO_Role role) {
        Role newRole = new Role();
        newRole.setName(role.getName());
        roleRepository.save(newRole);
    }

    @Override
    public DTO_Role findRoleByName(String name) {
        // do later
        return null;
    }

    @Override
    public void deleteRole(Long id) {
        // do later
    }

    @Override
    public DTO_Role updateRole(Long id, DTO_Role role) {
        // do later
        return null;
    }
    
}
