package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.KhungChuongTrinh;

@Repository
public interface KhungChuongTrinhRepository extends JpaRepository<KhungChuongTrinh, Integer> {
    
    @Query(value = "Select * From khungchuongtrinh Where ctdt_id = ?1", nativeQuery = true)
    List<KhungChuongTrinh> findByCTDT(Integer id);
}
