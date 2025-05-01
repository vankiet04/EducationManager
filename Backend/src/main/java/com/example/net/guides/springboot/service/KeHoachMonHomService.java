package com.example.net.guides.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.model.KeHoachMonHom;
import com.example.net.guides.springboot.repository.KeHoachMonHomRepository;

@Service
public class KeHoachMonHomService {
    
    @Autowired
    private KeHoachMonHomRepository keHoachMonHomRepository;

    public List<KeHoachMonHom> getAll() {
        return keHoachMonHomRepository.findAll();
    }

    public KeHoachMonHom getById(Integer id) {
        return keHoachMonHomRepository.findById(id).orElse(null);
    }

    public List<KeHoachMonHom> getByHocPhanId(Integer hocPhanId) {
        return keHoachMonHomRepository.findByHocPhanId(hocPhanId);
    }

    public List<KeHoachMonHom> getByNamHocAndHocKy(String namHoc, Integer hocKy) {
        return keHoachMonHomRepository.findByNamHocAndHocKy(namHoc, hocKy);
    }

    public KeHoachMonHom save(KeHoachMonHom keHoachMonHom) {
        return keHoachMonHomRepository.save(keHoachMonHom);
    }

    public void delete(Integer id) {
        keHoachMonHomRepository.deleteById(id);
    }
} 