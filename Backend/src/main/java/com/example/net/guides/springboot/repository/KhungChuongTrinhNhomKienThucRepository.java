package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.KhungChuongTrinhNhomKienThuc;

@Repository
public interface KhungChuongTrinhNhomKienThucRepository extends JpaRepository<KhungChuongTrinhNhomKienThuc, Integer> {
    
    List<KhungChuongTrinhNhomKienThuc> findByKhungChuongTrinh_Id(Integer khungChuongTrinhId);
    
    List<KhungChuongTrinhNhomKienThuc> findByNhomKienThuc_Id(Integer nhomKienThucId);
} 