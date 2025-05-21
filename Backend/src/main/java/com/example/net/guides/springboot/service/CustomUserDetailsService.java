package com.example.net.guides.springboot.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.net.guides.springboot.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(), 
            user.getPassword(), 
            user.getTrangThai(), // Use the active status field
            true, // Account non-expired
            true, // Credentials non-expired
            true, // Account non-locked
            getAuthorities(user)
        );
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Add roles from the roles collection
        for (Role role : user.getRoles()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getId()));
        }
        
        // Also add the vaiTro field for backward compatibility
        if (user.getVaiTro() != null && !user.getVaiTro().isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(user.getVaiTro()));
        }
        
        return authorities;
    }
}
