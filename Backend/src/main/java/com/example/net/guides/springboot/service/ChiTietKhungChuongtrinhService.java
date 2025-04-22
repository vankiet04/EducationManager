package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.ChiTietKhungChuongTrinhDTO;
import com.example.net.guides.springboot.model.ChiTietKhungChuongTrinh;
import com.example.net.guides.springboot.repository.ChiTietKhungChuongTrinhRepository;

import jakarta.transaction.Transactional;

@Service
public class ChiTietKhungChuongtrinhService {
    
    @Autowired
    private ChiTietKhungChuongTrinhRepository chiTietKhungChuongTrinhRepo;


    public List<ChiTietKhungChuongTrinhDTO> getByKhungChuongTrinhId(Integer khungChuongTrinhId) {
        List<ChiTietKhungChuongTrinh> chiTietList = chiTietKhungChuongTrinhRepo.findByKhungChuongTrinh_Id(khungChuongTrinhId);
        return chiTietList.stream().map(e ->{
            ChiTietKhungChuongTrinhDTO dto = new ChiTietKhungChuongTrinhDTO();
            dto.setId(e.getId());
            dto.setSoTinChiBatBuoc(e.getSoTinChiBatBuoc());
            dto.setSoTinChiTuChon(e.getSoTinChiTuChon());
            dto.setIdKhungChuongTrinh(e.getKhungChuongTrinh().getId());
            dto.setIdNhomKienThuc(e.getNhomKienThuc().getId());
            return dto;
        }).toList();
    }
}