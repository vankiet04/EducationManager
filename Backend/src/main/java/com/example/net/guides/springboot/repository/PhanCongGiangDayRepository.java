package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.PhanCongGiangDay;

@Repository
public interface PhanCongGiangDayRepository extends JpaRepository<PhanCongGiangDay, Integer> {
    
    List<PhanCongGiangDay> findByNhomId(Integer nhomId);

    List<PhanCongGiangDay> findByGiangVienId(Integer giangVienId);
} 