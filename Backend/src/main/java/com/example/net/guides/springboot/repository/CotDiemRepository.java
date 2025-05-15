package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.CotDiem;

@Repository
public interface CotDiemRepository extends JpaRepository<CotDiem, Integer> {
    
    List<CotDiem> findByDecuongChiTiet_Id(Integer decuongId);
} 