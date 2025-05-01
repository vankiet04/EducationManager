package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.KeHoachMonHom;

@Repository
public interface KeHoachMonHomRepository extends JpaRepository<KeHoachMonHom, Integer> {
    
    @Query("SELECT k FROM KeHoachMonHom k WHERE k.hocPhan.id = ?1")
    List<KeHoachMonHom> findByHocPhanId(Integer hocPhanId);

    @Query("SELECT k FROM KeHoachMonHom k WHERE k.namHoc = ?1 AND k.hocKy = ?2")
    List<KeHoachMonHom> findByNamHocAndHocKy(String namHoc, Integer hocKy);
} 