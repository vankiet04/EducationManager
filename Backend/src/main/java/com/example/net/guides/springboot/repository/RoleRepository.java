package com.example.net.guides.springboot.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.net.guides.springboot.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}