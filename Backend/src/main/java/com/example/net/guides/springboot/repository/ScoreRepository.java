package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.net.guides.springboot.model.Score;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Score findByID (Integer id);
    List<Score> findbyOutlineDetailID (Integer outlineDetailID);
    
}

