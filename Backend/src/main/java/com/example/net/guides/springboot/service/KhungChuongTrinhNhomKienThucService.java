package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.KhungChuongTrinhNhomKienThucDTO;
import com.example.net.guides.springboot.model.KhungChuongTrinhNhomKienThuc;
import com.example.net.guides.springboot.repository.KhungChuongTrinhNhomKienThucRepository;
import com.example.net.guides.springboot.repository.KhungChuongTrinhRepository;
import com.example.net.guides.springboot.repository.NhomKienThucRepository;

@Service
public class KhungChuongTrinhNhomKienThucService {

    @Autowired
    private KhungChuongTrinhNhomKienThucRepository khungNhomRepository;
    
    @Autowired
    private KhungChuongTrinhRepository khungRepository;
    
    @Autowired
    private NhomKienThucRepository nhomRepository;
    
    private KhungChuongTrinhNhomKienThucDTO chuyenDoiDTO(KhungChuongTrinhNhomKienThuc entity) {
        KhungChuongTrinhNhomKienThucDTO dto = new KhungChuongTrinhNhomKienThucDTO();
        dto.setId(entity.getId());
        dto.setIdKhungChuongTrinh(entity.getKhungChuongTrinh().getId());
        dto.setIdMaNhom(entity.getNhomKienThuc().getId());
        dto.setSoTinChiBatBuoc(entity.getSoTinChiBatBuoc());
        dto.setSoTinChiTuChon(entity.getSoTinChiTuChon());
        return dto;
    }
    
    private KhungChuongTrinhNhomKienThuc chuyenDoiEntity(KhungChuongTrinhNhomKienThucDTO dto) {
        KhungChuongTrinhNhomKienThuc entity = new KhungChuongTrinhNhomKienThuc();
        entity.setId(dto.getId());
        entity.setKhungChuongTrinh(khungRepository.findById(dto.getIdKhungChuongTrinh()).orElse(null));
        entity.setNhomKienThuc(nhomRepository.findById(dto.getIdMaNhom()).orElse(null));
        entity.setSoTinChiBatBuoc(dto.getSoTinChiBatBuoc());
        entity.setSoTinChiTuChon(dto.getSoTinChiTuChon());
        return entity;
    }
    
    public List<KhungChuongTrinhNhomKienThucDTO> findAll() {
        return khungNhomRepository.findAll().stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<KhungChuongTrinhNhomKienThucDTO> findById(Integer id) {
        return khungNhomRepository.findById(id)
                .map(this::chuyenDoiDTO);
    }
    
    public List<KhungChuongTrinhNhomKienThucDTO> findByKhungChuongTrinhId(Integer khungId) {
        return khungNhomRepository.findByKhungChuongTrinh_Id(khungId).stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }
    
    public List<KhungChuongTrinhNhomKienThucDTO> findByNhomKienThucId(Integer nhomId) {
        return khungNhomRepository.findByNhomKienThuc_Id(nhomId).stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }
    
    public KhungChuongTrinhNhomKienThucDTO create(KhungChuongTrinhNhomKienThucDTO dto) {
        KhungChuongTrinhNhomKienThuc entity = chuyenDoiEntity(dto);
        khungNhomRepository.save(entity);
        return chuyenDoiDTO(entity);
    }
    
    public Optional<KhungChuongTrinhNhomKienThucDTO> update(KhungChuongTrinhNhomKienThucDTO dto) {
        return khungNhomRepository.findById(dto.getId())
                .map(existingEntity -> {
                    KhungChuongTrinhNhomKienThuc updatedEntity = chuyenDoiEntity(dto);
                    khungNhomRepository.save(updatedEntity);
                    return chuyenDoiDTO(updatedEntity);
                });
    }
    
    public boolean delete(Integer id) {
        return khungNhomRepository.findById(id)
                .map(entity -> {
                    khungNhomRepository.delete(entity);
                    return true;
                })
                .orElse(false);
    }
} 