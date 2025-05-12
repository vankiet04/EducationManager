package com.example.net.guides.springboot.service;
import com.example.net.guides.springboot.model.OutlineDetail;
import com.example.net.guides.springboot.repository.OutlineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OutlineDetailServiceImpl implements OutlineDetailService {
    @Autowired
    private OutlineDetailRepository outlineDetailRepository;
    
    @Override
    public OutlineDetail findById(Integer id) {
        return outlineDetailRepository.findById(id);
    }
    
    @Override
    public List<OutlineDetail> findAll() {
        return outlineDetailRepository.findAll();
    }
}