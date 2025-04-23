package com.example.net.guides.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.ThongTinChung;

@Repository
public interface ThongTinChungRepository  extends JpaRepository<ThongTinChung, Integer>{

    boolean existsByMaCtdt(String maCtdt);
}
