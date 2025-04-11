package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.ChiTietKhungChuongTrinh;

@Repository
public interface ChiTietKhungChuongTrinhRepository extends JpaRepository<ChiTietKhungChuongTrinh, Integer> {


    List<ChiTietKhungChuongTrinh> findByKhungChuongTrinh_Id(Integer khungChuongTrinhId);

}
