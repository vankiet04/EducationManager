package com.example.net.guides.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.net.guides.springboot.model.Score;

public interface ScoreRepository extends JpaRepository<Score, Integer> {
    Optional<Score> findById (Integer id);
    //List<Score> findbyOutlineDetailID (Integer outlineDetailID);
    
    List<Score> findByOutlineDetailId(Integer outlineDetailId);
}

