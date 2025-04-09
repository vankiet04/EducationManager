package com.example.net.guides.springboot.service;

import java.util.List;

import com.example.net.guides.springboot.model.Score;

public interface ScoreService {
    Score findById(Integer id);
    List<Score> findByOutlineDetailID(Integer outlineDetailID);
}
