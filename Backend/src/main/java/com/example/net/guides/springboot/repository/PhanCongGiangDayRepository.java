package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.PhanCongGiangDay;

@Repository
public interface PhanCongGiangDayRepository extends JpaRepository<PhanCongGiangDay, Integer> {
    
    @Query("SELECT p FROM PhanCongGiangDay p WHERE p.nhom.id = ?1")
    List<PhanCongGiangDay> findByNhomId(Integer nhomId);

    @Query("SELECT p FROM PhanCongGiangDay p WHERE p.giangVien.id = ?1")
    List<PhanCongGiangDay> findByGiangVienId(Integer giangVienId);
} 