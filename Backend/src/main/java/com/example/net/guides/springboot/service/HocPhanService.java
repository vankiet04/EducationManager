package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.HocPhanDTO;
import com.example.net.guides.springboot.model.HocPhan;
import com.example.net.guides.springboot.repository.HocPhanRepository;
import com.example.net.guides.springboot.repository.NhomKienThucRepository;

@Service
public class HocPhanService {

    @Autowired
    private HocPhanRepository hocPhanRepo;
    
    @Autowired
    private NhomKienThucRepository nhomKienThucRepo;

    private HocPhanDTO ChuyenDoiDTO(HocPhan hocPhan) {
        HocPhanDTO dto = new HocPhanDTO();
        dto.setId(hocPhan.getId());
        dto.setMaHp(hocPhan.getMaHp());
        dto.setTenHp(hocPhan.getTenHp());
        dto.setSoTinChi(hocPhan.getSoTinChi());
        dto.setSoTietLyThuyet(hocPhan.getSoTietLyThuyet());
        dto.setSoTietThucHanh(hocPhan.getSoTietThucHanh());
        dto.setNhomKienThucID(hocPhan.getNhomKienThucID().getId());
        dto.setLoaiHp(hocPhan.getLoaiHp());
        dto.setHocPhanTienQuyet(hocPhan.getHocPhanTienQuyet());
        dto.setTrangThai(hocPhan.getTrangThai());
        return dto;
    }

    private HocPhan ChuyenDoiEntity(HocPhanDTO dto) {
        HocPhan hocPhan = new HocPhan();
        hocPhan.setId(dto.getId());
        hocPhan.setMaHp(dto.getMaHp());
        hocPhan.setTenHp(dto.getTenHp());
        hocPhan.setSoTinChi(dto.getSoTinChi());
        hocPhan.setSoTietLyThuyet(dto.getSoTietLyThuyet());
        hocPhan.setSoTietThucHanh(dto.getSoTietThucHanh());
        hocPhan.setNhomKienThucID(nhomKienThucRepo.findById(dto.getNhomKienThucID()).get());
        hocPhan.setLoaiHp(dto.getLoaiHp());
        hocPhan.setHocPhanTienQuyet(dto.getHocPhanTienQuyet());
        hocPhan.setTrangThai(dto.getTrangThai());
        return hocPhan;
    }
    

    public List<HocPhanDTO> findAll() {
        return hocPhanRepo.findByTrangThaiIsFalse().stream()
                .map(this::ChuyenDoiDTO)
                .collect(Collectors.toList());
    }

    public Page<HocPhanDTO> findAllPaging(int page, int size) {
        return hocPhanRepo.findByTrangThaiIsFalse(PageRequest.of(page, size))
                .map(this::ChuyenDoiDTO);
    }

    public Optional<HocPhanDTO> findById(Integer id) {
        return hocPhanRepo.findByIdAndTrangThaiIsFalse(id)
                .map(this::ChuyenDoiDTO);
    }

    public HocPhanDTO create(HocPhanDTO dto) {
        HocPhan hocPhan = ChuyenDoiEntity(dto);
        hocPhan.setTrangThai(0);
        hocPhanRepo.save(hocPhan);
        return ChuyenDoiDTO(hocPhan);
    }

    public Optional<HocPhanDTO> update(HocPhanDTO dto) {
        return hocPhanRepo.findById(dto.getId())
                .map(existingHocPhan -> {
                    HocPhan updatedHocPhan = ChuyenDoiEntity(dto);
                    updatedHocPhan.setTrangThai(existingHocPhan.getTrangThai());
                    hocPhanRepo.save(updatedHocPhan);
                    return ChuyenDoiDTO(updatedHocPhan);
                });
    }

    public boolean delete(Integer id) {
        return hocPhanRepo.findByIdAndTrangThaiIsFalse(id)
                .map(hocPhan -> {
                    hocPhan.setTrangThai(1);
                    hocPhanRepo.save(hocPhan);
                    return true;
                })
                .orElse(false);
    }
}
