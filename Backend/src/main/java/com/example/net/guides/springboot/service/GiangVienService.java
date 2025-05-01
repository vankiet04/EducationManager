package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.repository.GiangVienRepository;

@Service
public class GiangVienService {
    
    @Autowired
    private GiangVienRepository giangVienRepository;

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

    public GiangVien getByEmail(String email) {
        return giangVienRepository.findByEmail(email);
    }

    public GiangVien save(GiangVien giangVien) {
        return giangVienRepository.save(giangVien);
    }

    public void delete(Integer id) {
        giangVienRepository.deleteById(id);
    }
} 