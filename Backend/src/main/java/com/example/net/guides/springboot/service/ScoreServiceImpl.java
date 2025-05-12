package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.net.guides.springboot.model.Score;
import com.example.net.guides.springboot.repository.ScoreRepository;

@Service
public class ScoreServiceImpl implements ScoreService {
    @Autowired
    private ScoreRepository scoreRepository;

    @Override
    public Score findById(Integer id) {
        return scoreRepository.findById(id).orElse(null);
    }
    
    @Override
    public List<Score> findByOutlineDetailID(Integer outlineDetailID) {
        return scoreRepository.findByOutlineDetailId(outlineDetailID);
    }
}
