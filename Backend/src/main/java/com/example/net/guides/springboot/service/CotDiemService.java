package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.CotDiemDTO;
import com.example.net.guides.springboot.model.CotDiem;
import com.example.net.guides.springboot.repository.CotDiemRepository;
import com.example.net.guides.springboot.repository.DecuongChiTietRepository;

@Service
public class CotDiemService {

    @Autowired
    private CotDiemRepository cotDiemRepository;
    
    @Autowired
    private DecuongChiTietRepository decuongRepository;
    
    private CotDiemDTO chuyenDoiDTO(CotDiem cotDiem) {
        CotDiemDTO dto = new CotDiemDTO();
        dto.setId(cotDiem.getId());
        dto.setDecuongId(cotDiem.getDecuongChiTiet().getId());
        dto.setTenCotDiem(cotDiem.getTenCotDiem());
        dto.setTyLePhanTram(cotDiem.getTyLePhanTram());
        dto.setHinhThuc(cotDiem.getHinhThuc());
        return dto;
    }
    
    private CotDiem chuyenDoiEntity(CotDiemDTO dto) {
        CotDiem cotDiem = new CotDiem();
        cotDiem.setId(dto.getId());
        cotDiem.setDecuongChiTiet(decuongRepository.findById(dto.getDecuongId()).orElse(null));
        cotDiem.setTenCotDiem(dto.getTenCotDiem());
        cotDiem.setTyLePhanTram(dto.getTyLePhanTram());
        cotDiem.setHinhThuc(dto.getHinhThuc());
        return cotDiem;
    }
    
    public List<CotDiemDTO> findAll() {
        return cotDiemRepository.findAll().stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<CotDiemDTO> findById(Integer id) {
        return cotDiemRepository.findById(id)
                .map(this::chuyenDoiDTO);
    }
    
    public List<CotDiemDTO> findByDecuongId(Integer decuongId) {
        return cotDiemRepository.findByDecuongChiTiet_Id(decuongId).stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }
    
    public CotDiemDTO create(CotDiemDTO dto) {
        CotDiem cotDiem = chuyenDoiEntity(dto);
        cotDiemRepository.save(cotDiem);
        return chuyenDoiDTO(cotDiem);
    }
    
    public Optional<CotDiemDTO> update(CotDiemDTO dto) {
        return cotDiemRepository.findById(dto.getId())
                .map(existingCotDiem -> {
                    CotDiem updatedCotDiem = chuyenDoiEntity(dto);
                    cotDiemRepository.save(updatedCotDiem);
                    return chuyenDoiDTO(updatedCotDiem);
                });
    }
    
    public boolean delete(Integer id) {
        return cotDiemRepository.findById(id)
                .map(cotDiem -> {
                    cotDiemRepository.delete(cotDiem);
                    return true;
                })
                .orElse(false);
    }
} 