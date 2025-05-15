package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.DecuongChiTietDTO;
import com.example.net.guides.springboot.model.DecuongChiTiet;
import com.example.net.guides.springboot.repository.DecuongChiTietRepository;
import com.example.net.guides.springboot.repository.HocPhanRepository;

@Service
public class DecuongChiTietService {

    @Autowired
    private DecuongChiTietRepository decuongRepository;
    
    @Autowired
    private HocPhanRepository hocPhanRepository;

    private DecuongChiTietDTO chuyenDoiDTO(DecuongChiTiet decuong) {
        DecuongChiTietDTO dto = new DecuongChiTietDTO();
        dto.setId(decuong.getId());
        dto.setHocPhanId(decuong.getHocPhan().getId());
        dto.setMucTieu(decuong.getMucTieu());
        dto.setNoiDung(decuong.getNoiDung());
        dto.setPhuongPhapGiangDay(decuong.getPhuongPhapGiangDay());
        dto.setPhuongPhapDanhGia(decuong.getPhuongPhapDanhGia());
        dto.setTaiLieuThamKhao(decuong.getTaiLieuThamKhao());
        dto.setTrangThai(decuong.getTrangThai());
        return dto;
    }

    private DecuongChiTiet chuyenDoiEntity(DecuongChiTietDTO dto) {
        DecuongChiTiet decuong = new DecuongChiTiet();
        decuong.setId(dto.getId());
        decuong.setHocPhan(hocPhanRepository.findById(dto.getHocPhanId()).orElse(null));
        decuong.setMucTieu(dto.getMucTieu());
        decuong.setNoiDung(dto.getNoiDung());
        decuong.setPhuongPhapGiangDay(dto.getPhuongPhapGiangDay());
        decuong.setPhuongPhapDanhGia(dto.getPhuongPhapDanhGia());
        decuong.setTaiLieuThamKhao(dto.getTaiLieuThamKhao());
        decuong.setTrangThai(dto.getTrangThai());
        return decuong;
    }
    
    public List<DecuongChiTietDTO> findAll() {
        return decuongRepository.findByTrangThaiNot(-1).stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }

    public Page<DecuongChiTietDTO> findAllPaging(int page, int size) {
        return decuongRepository.findByTrangThaiNot(-1, PageRequest.of(page, size))
                .map(this::chuyenDoiDTO);
    }

    public Optional<DecuongChiTietDTO> findById(Integer id) {
        return decuongRepository.findByIdAndTrangThaiNot(id, -1)
                .map(this::chuyenDoiDTO);
    }
    
    public List<DecuongChiTietDTO> findByHocPhanId(Integer hocPhanId) {
        return decuongRepository.findByHocPhan_Id(hocPhanId).stream()
                .map(this::chuyenDoiDTO)
                .collect(Collectors.toList());
    }

    public DecuongChiTietDTO create(DecuongChiTietDTO dto) {
        DecuongChiTiet decuong = chuyenDoiEntity(dto);
        decuong.setTrangThai(1); // Đặt trạng thái mặc định là 1 (đang hoạt động)
        decuongRepository.save(decuong);
        return chuyenDoiDTO(decuong);
    }

    public Optional<DecuongChiTietDTO> update(DecuongChiTietDTO dto) {
        return decuongRepository.findById(dto.getId())
                .map(existingDecuong -> {
                    DecuongChiTiet updatedDecuong = chuyenDoiEntity(dto);
                    decuongRepository.save(updatedDecuong);
                    return chuyenDoiDTO(updatedDecuong);
                });
    }

    public boolean delete(Integer id) {
        return decuongRepository.findByIdAndTrangThaiNot(id, -1)
                .map(decuong -> {
                    decuong.setTrangThai(-1); // Đánh dấu là đã xóa
                    decuongRepository.save(decuong);
                    return true;
                })
                .orElse(false);
    }
} 