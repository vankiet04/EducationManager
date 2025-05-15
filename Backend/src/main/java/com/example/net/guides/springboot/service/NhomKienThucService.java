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
        // Return only active records (trangThai != 0)
        return nhomKienThucRepo.findByTrangThaiNot(0);
    }

    public Optional<NhomKienThuc> getById(Integer id){
        // Return only if active (trangThai != 0)
        return nhomKienThucRepo.findByIdAndTrangThaiNot(id, 0);
    }
    
    public NhomKienThuc save(NhomKienThuc nhomKienThuc){
        // Set default status to active if not provided
        if (nhomKienThuc.getTrangThai() == null) {
            nhomKienThuc.setTrangThai(1);
        }
        return nhomKienThucRepo.save(nhomKienThuc);
    }

    public Page<NhomKienThuc> getAllPaging(int page, int size) {
        // Return only active records (trangThai != 0)
        return nhomKienThucRepo.findByTrangThaiNot(0, PageRequest.of(page, size));
    }
    
    public boolean delete(Integer id) {
        Optional<NhomKienThuc> optionalNhomKienThuc = nhomKienThucRepo.findById(id);
        if (optionalNhomKienThuc.isPresent()) {
            NhomKienThuc nhomKienThuc = optionalNhomKienThuc.get();
            // Soft delete - set trangThai to 0
            nhomKienThuc.setTrangThai(0);
            nhomKienThucRepo.save(nhomKienThuc);
            return true;
        }
        return false;
    }
}
