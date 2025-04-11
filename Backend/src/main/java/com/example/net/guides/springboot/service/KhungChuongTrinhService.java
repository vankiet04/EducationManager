package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.KhungChuongTrinh;
import com.example.net.guides.springboot.repository.KhungChuongTrinhRepository;

@Service
public class KhungChuongTrinhService {
    
    @Autowired
    private KhungChuongTrinhRepository khungChuongTrinhRepo;

    public List<KhungChuongTrinh> getAll(){
        return khungChuongTrinhRepo.findAll();
    }

    public List<KhungChuongTrinh> getByCTDT(Integer id){
        return khungChuongTrinhRepo.findByCTDT(id);
    }
}
