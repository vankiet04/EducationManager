package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.PhanCongGiangDay;
import com.example.net.guides.springboot.dto.PhanCongGiangDayDTO;
import com.example.net.guides.springboot.repository.PhanCongGiangDayRepository;

@Service
public class PhanCongGiangDayService {
    
    @Autowired
    private PhanCongGiangDayRepository phanCongGiangDayRepository;

    private PhanCongGiangDayDTO toDTO(PhanCongGiangDay entity) {
        if (entity == null) return null;
        PhanCongGiangDayDTO dto = new PhanCongGiangDayDTO();
        dto.setId(entity.getId());
        dto.setNhomId(entity.getNhom() != null ? entity.getNhom().getId() : null);
        dto.setGiangVienId(entity.getGiangVien() != null ? entity.getGiangVien().getId() : null);
        dto.setVaiTro(entity.getVaiTro());
        dto.setSoTiet(entity.getSoTiet());
        return dto;
    }

    public List<PhanCongGiangDayDTO> getAll() {
        return phanCongGiangDayRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PhanCongGiangDayDTO getById(Integer id) {
        return phanCongGiangDayRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public List<PhanCongGiangDayDTO> getByNhomId(Integer nhomId) {
        return phanCongGiangDayRepository.findByNhomId(nhomId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PhanCongGiangDayDTO> getByGiangVienId(Integer giangVienId) {
        return phanCongGiangDayRepository.findByGiangVienId(giangVienId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PhanCongGiangDay save(PhanCongGiangDay phanCongGiangDay) {
        return phanCongGiangDayRepository.save(phanCongGiangDay);
    }

    public void delete(Integer id) {
        phanCongGiangDayRepository.deleteById(id);
    }
} 