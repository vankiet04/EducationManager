package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.KeHoachMonHom;
import com.example.net.guides.springboot.dto.KeHoachMonHomDTO;
import com.example.net.guides.springboot.repository.KeHoachMonHomRepository;

@Service
public class KeHoachMonHomService {
    
    @Autowired
    private KeHoachMonHomRepository keHoachMonHomRepository;

    private KeHoachMonHomDTO toDTO(KeHoachMonHom entity) {
        if (entity == null) return null;
        KeHoachMonHomDTO dto = new KeHoachMonHomDTO();
        dto.setId(entity.getId());
        dto.setHocPhanId(entity.getHocPhan() != null ? entity.getHocPhan().getId() : null);
        dto.setMaNhom(entity.getMaNhom());
        dto.setNamHoc(entity.getNamHoc());
        dto.setHocKy(entity.getHocKy());
        dto.setThoiGianBatDau(entity.getThoiGianBatDau());
        dto.setThoiGianKetThuc(entity.getThoiGianKetThuc());
        dto.setSoLuongSV(entity.getSoLuongSv());
        dto.setTrangThai(entity.getTrangThai());
        return dto;
    }

    public List<KeHoachMonHomDTO> getAll() {
        return keHoachMonHomRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public KeHoachMonHomDTO getById(Integer id) {
        return keHoachMonHomRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public List<KeHoachMonHomDTO> getByHocPhanId(Integer hocPhanId) {
        return keHoachMonHomRepository.findByHocPhanId(hocPhanId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<KeHoachMonHomDTO> getByNamHocAndHocKy(String namHoc, Integer hocKy) {
        return keHoachMonHomRepository.findByNamHocAndHocKy(namHoc, hocKy).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public KeHoachMonHom save(KeHoachMonHom keHoachMonHom) {
        return keHoachMonHomRepository.save(keHoachMonHom);
    }

    public void delete(Integer id) {
        keHoachMonHomRepository.deleteById(id);
    }
} 