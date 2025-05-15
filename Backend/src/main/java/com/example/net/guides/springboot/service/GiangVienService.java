package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.repository.GiangVienRepository;
import com.example.net.guides.springboot.repository.UserRepository;

@Service
public class GiangVienService {
    
    @Autowired
    private GiangVienRepository giangVienRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<GiangVien> getAll() {
        return giangVienRepository.findAll();
    }

    public GiangVien getById(Integer id) {
        return giangVienRepository.findById(id).orElse(null);
    }

    public GiangVien getByMaGiangVien(String maGiangVien) {
        return giangVienRepository.findByMaGiangVien(maGiangVien);
    }

    public List<GiangVien> getByHoTen(String hoTen) {
        return giangVienRepository.findByHoTenContaining(hoTen);
    }

    public GiangVien getByUserId(Integer userId) {
        return giangVienRepository.findByUserId(userId);
    }

    public List<GiangVien> getByKhoa(String khoa) {
        return giangVienRepository.findByKhoa(khoa);
    }

    public List<GiangVien> getByBoMon(String boMon) {
        return giangVienRepository.findByBoMon(boMon);
    }

    @Transactional
    public GiangVien save(GiangVien giangVien) {
        // If this is a new lecturer with a user ID, make sure the user has GIANG_VIEN role
        if (giangVien.getUserId() != null) {
            User user = userRepository.findById(giangVien.getUserId()).orElse(null);
            if (user != null && !"GIANG_VIEN".equals(user.getVaiTro())) {
                user.setVaiTro("GIANG_VIEN");
                userRepository.save(user);
            }
        }
        return giangVienRepository.save(giangVien);
    }
    
    @Transactional
    public GiangVien assignUserToLecturer(Integer lecturerId, Integer userId) {
        GiangVien giangVien = giangVienRepository.findById(lecturerId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (giangVien != null && user != null) {
            // Check if this user is already assigned to another lecturer
            GiangVien existingGiangVien = giangVienRepository.findByUserId(userId);
            if (existingGiangVien != null && !existingGiangVien.getId().equals(lecturerId)) {
                throw new RuntimeException("User đã được gán cho một giảng viên khác!");
            }
            
            // Update user role to GIANG_VIEN if not already set
            if (!"GIANG_VIEN".equals(user.getVaiTro())) {
                user.setVaiTro("GIANG_VIEN");
                userRepository.save(user);
            }
            
            giangVien.setUserId(userId);
            return giangVienRepository.save(giangVien);
        }
        
        return null;
    }

    @Transactional
    public GiangVien delete(Integer id) {
        GiangVien giangVien = giangVienRepository.findById(id).orElse(null);
        if (giangVien != null) {
            giangVien.setTrangThai(0);
            return giangVienRepository.save(giangVien);
        }
        return null;
    }
    
    @Transactional
    public GiangVien removeUserFromLecturer(Integer lecturerId) {
        GiangVien giangVien = giangVienRepository.findById(lecturerId).orElse(null);
        
        if (giangVien != null && giangVien.getUserId() != null) {
            Integer userId = giangVien.getUserId();
            giangVien.setUserId(null);
            giangVienRepository.save(giangVien);
            
            // Optionally change the user's role back if needed
            /*
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setVaiTro("NGUOI_DUNG");
                userRepository.save(user);
            }
            */
            
            return giangVien;
        }
        
        return null;
    }
} 