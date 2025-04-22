package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.NhomKienThuc;
import com.example.net.guides.springboot.repository.NhomKienThucRepository;

@Service
public class NhomKienThucService {
    
    @Autowired
    private NhomKienThucRepository nhomKienThucRepo;

    public List<NhomKienThuc> getAll(){
        return nhomKienThucRepo.findAll();
    }

    public Optional<NhomKienThuc> getById(Integer id){
        return nhomKienThucRepo.findById(id);
    }
    public NhomKienThuc save(NhomKienThuc nhomKienThuc){
        return nhomKienThucRepo.save(nhomKienThuc);
    }

    public Page<NhomKienThuc> getAllPaging(int page, int size) {
        return nhomKienThucRepo.findAll(PageRequest.of(page, size));
    }
}
