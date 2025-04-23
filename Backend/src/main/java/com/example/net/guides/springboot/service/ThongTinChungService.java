package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.ThongTinChung;
import com.example.net.guides.springboot.repository.ThongTinChungRepository;

@Service
public class ThongTinChungService {

    @Autowired
    private ThongTinChungRepository thongTinChungRepo;
    
    public List<ThongTinChung> getAll() {
        return thongTinChungRepo.findAll();
    }

    public Optional<ThongTinChung> getById(int id) {
        return thongTinChungRepo.findById(id);
    }

    public Page<ThongTinChung> getAllPaging(int page, int size){
        return thongTinChungRepo.findAll(PageRequest.of(page, size));
    }

    public boolean existsByMaCtdt(String maCtdt) {
        return thongTinChungRepo.existsByMaCtdt(maCtdt);
    }

    public ThongTinChung save(ThongTinChung ttc){
        return thongTinChungRepo.save(ttc);
    }

    public boolean update(ThongTinChung ttc){
        if(thongTinChungRepo.existsById(ttc.getId())){
            thongTinChungRepo.save(ttc);
            return true;
        }
        return false;
    }

    
}
