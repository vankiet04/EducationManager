package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.PhanCongGiangDay;
import com.example.net.guides.springboot.repository.PhanCongGiangDayRepository;

@Service
public class PhanCongGiangDayService {
    
    @Autowired
    private PhanCongGiangDayRepository phanCongGiangDayRepository;

    public List<PhanCongGiangDay> getAll() {
        return phanCongGiangDayRepository.findAll();
    }

    public PhanCongGiangDay getById(Integer id) {
        return phanCongGiangDayRepository.findById(id).orElse(null);
    }

    public List<PhanCongGiangDay> getByNhomId(Integer nhomId) {
        return phanCongGiangDayRepository.findByNhomId(nhomId);
    }

    public List<PhanCongGiangDay> getByGiangVienId(Integer giangVienId) {
        return phanCongGiangDayRepository.findByGiangVienId(giangVienId);
    }

    public PhanCongGiangDay save(PhanCongGiangDay phanCongGiangDay) {
        return phanCongGiangDayRepository.save(phanCongGiangDay);
    }

    public void delete(Integer id) {
        phanCongGiangDayRepository.deleteById(id);
    }
} 