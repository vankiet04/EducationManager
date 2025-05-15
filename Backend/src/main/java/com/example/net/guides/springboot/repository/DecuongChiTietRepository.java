package com.example.net.guides.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.DecuongChiTiet;

@Repository
public interface DecuongChiTietRepository extends JpaRepository<DecuongChiTiet, Integer> {
    
    List<DecuongChiTiet> findByTrangThaiNot(Integer trangThai);
    
    Page<DecuongChiTiet> findByTrangThaiNot(Integer trangThai, Pageable pageable);
    
    Optional<DecuongChiTiet> findByIdAndTrangThaiNot(Integer id, Integer trangThai);
    
    List<DecuongChiTiet> findByHocPhan_Id(Integer hocPhanId);
} 