package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.service.GiangVienService;

@RestController
@RequestMapping("/api/giangvien")
public class GiangVienController {

    @Autowired
    private GiangVienService giangVienService;

    @GetMapping
    public ResponseEntity<List<GiangVien>> getAll() {
        return ResponseEntity.ok(giangVienService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GiangVien> getById(@PathVariable Integer id) {
        GiangVien giangVien = giangVienService.getById(id);
        if (giangVien != null) {
            return ResponseEntity.ok(giangVien);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/ma/{maGiangVien}")
    public ResponseEntity<GiangVien> getByMaGiangVien(@PathVariable String maGiangVien) {
        GiangVien giangVien = giangVienService.getByMaGiangVien(maGiangVien);
        if (giangVien != null) {
            return ResponseEntity.ok(giangVien);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<GiangVien>> getByHoTen(@RequestParam String hoTen) {
        return ResponseEntity.ok(giangVienService.getByHoTen(hoTen));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<GiangVien> getByUserId(@PathVariable Integer userId) {
        GiangVien giangVien = giangVienService.getByUserId(userId);
        if (giangVien != null) {
            return ResponseEntity.ok(giangVien);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/khoa/{khoa}")
    public ResponseEntity<List<GiangVien>> getByKhoa(@PathVariable String khoa) {
        return ResponseEntity.ok(giangVienService.getByKhoa(khoa));
    }

    @GetMapping("/bomon/{boMon}")
    public ResponseEntity<List<GiangVien>> getByBoMon(@PathVariable String boMon) {
        return ResponseEntity.ok(giangVienService.getByBoMon(boMon));
    }

    @PostMapping
    public ResponseEntity<GiangVien> create(@RequestBody GiangVien giangVien) {
        return ResponseEntity.ok(giangVienService.save(giangVien));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GiangVien> update(@PathVariable Integer id, @RequestBody GiangVien giangVien) {
        if (giangVienService.getById(id) != null) {
            giangVien.setId(id);
            return ResponseEntity.ok(giangVienService.save(giangVien));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<GiangVien> delete(@PathVariable Integer id) {
        GiangVien giangVien = giangVienService.delete(id);
        if (giangVien != null) {
            return ResponseEntity.ok(giangVien);
        }
        return ResponseEntity.notFound().build();
    }
} 