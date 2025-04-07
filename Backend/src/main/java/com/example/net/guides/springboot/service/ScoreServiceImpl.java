package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.net.guides.springboot.model.Score;
import com.example.net.guides.springboot.repository.ScoreRepository;

public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private ScoreRepository scoreRepository;

    @Override
    public Score findById(Integer id) {
        // Implementation here
        return null;
    }
    
    @Override
    public List<Score> findByOutlineDetailID(Integer outlineDetailID) {
        // Implementation here
        return null;
    }
}
