package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.GiangVien;

@Repository
public interface GiangVienRepository extends JpaRepository<GiangVien, Integer> {
    
    @Query("SELECT g FROM GiangVien g WHERE g.maGiangVien = ?1")
    GiangVien findByMaGiangVien(String maGiangVien);

    @Query("SELECT g FROM GiangVien g WHERE g.hoTen LIKE %?1%")
    List<GiangVien> findByHoTenContaining(String hoTen);

    @Query("SELECT g FROM GiangVien g WHERE g.email = ?1")
    GiangVien findByEmail(String email);
} 