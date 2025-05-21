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
        dto.setNhomId(entity.getNhomId());
        dto.setGiangVienId(entity.getGiangVienId());
        dto.setVaiTro(entity.getVaiTro());
        dto.setSoTiet(entity.getSoTiet());
        return dto;
    }
    
    private PhanCongGiangDay toEntity(PhanCongGiangDayDTO dto) {
        if (dto == null) return null;
        PhanCongGiangDay entity = new PhanCongGiangDay();
        entity.setId(dto.getId());
        entity.setNhomId(dto.getNhomId());
        entity.setGiangVienId(dto.getGiangVienId());
        entity.setVaiTro(dto.getVaiTro());
        entity.setSoTiet(dto.getSoTiet());
        return entity;
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

    public PhanCongGiangDayDTO save(PhanCongGiangDayDTO dto) {
        PhanCongGiangDay entity = toEntity(dto);
        entity = phanCongGiangDayRepository.save(entity);
        return toDTO(entity);
    }

    public void delete(Integer id) {
        phanCongGiangDayRepository.deleteById(id);
    }
} 