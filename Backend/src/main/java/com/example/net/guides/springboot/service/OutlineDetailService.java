package com.example.net.guides.springboot.service;

import com.example.net.guides.springboot.model.OutlineDetail;
import java.util.List;

public interface OutlineDetailService {
    OutlineDetail findById(Integer id);
    List<OutlineDetail> findAll();
}
