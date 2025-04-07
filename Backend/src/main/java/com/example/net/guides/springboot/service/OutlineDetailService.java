package com.example.net.guides.springboot.service;

import com.example.net.guides.springboot.model.OutlineDetail;

public interface OutlineDetailService {
    OutlineDetail findById(Integer id);
    OutlineDetail findAll();
}
