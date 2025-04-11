package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.ChiTietKhungChuongTrinh;
import com.example.net.guides.springboot.repository.ChiTietKhungChuongTrinhRepository;

import jakarta.transaction.Transactional;

@Service
public class ChiTietKhungChuongtrinhService {
    
    @Autowired
    private ChiTietKhungChuongTrinhRepository chiTietKhungChuongTrinhRepo;

    @Transactional
    public List<ChiTietKhungChuongTrinh> getByKhungChuongTrinhId(Integer khungChuongTrinhId) {
        return chiTietKhungChuongTrinhRepo.findByKhungChuongTrinh_Id(khungChuongTrinhId);
    }
}