package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.model.OutlineDetail;
import com.example.net.guides.springboot.repository.OutlineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class OutlineDetailServiceImpl implements OutlineDetailService {
    @Autowired
    private OutlineDetailRepository outlineDetailRepository;
    
    @Override
    public OutlineDetail findById(Integer id) {
        // Implementation here
        return null;
    }
    
    @Override
    public OutlineDetail findAll() {
        // Implementation here
        return null;
    }
}