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
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.model.PhanCongGiangDay;
import com.example.net.guides.springboot.service.PhanCongGiangDayService;

@RestController
@RequestMapping("/api/phanconggiangday")
public class PhanCongGiangDayController {

    @Autowired
    private PhanCongGiangDayService phanCongGiangDayService;

    @GetMapping
    public ResponseEntity<List<PhanCongGiangDay>> getAll() {
        return ResponseEntity.ok(phanCongGiangDayService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhanCongGiangDay> getById(@PathVariable Integer id) {
        PhanCongGiangDay phanCongGiangDay = phanCongGiangDayService.getById(id);
        if (phanCongGiangDay != null) {
            return ResponseEntity.ok(phanCongGiangDay);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/nhom/{nhomId}")
    public ResponseEntity<List<PhanCongGiangDay>> getByNhomId(@PathVariable Integer nhomId) {
        return ResponseEntity.ok(phanCongGiangDayService.getByNhomId(nhomId));
    }

    @GetMapping("/giangvien/{giangVienId}")
    public ResponseEntity<List<PhanCongGiangDay>> getByGiangVienId(@PathVariable Integer giangVienId) {
        return ResponseEntity.ok(phanCongGiangDayService.getByGiangVienId(giangVienId));
    }

    @PostMapping
    public ResponseEntity<PhanCongGiangDay> create(@RequestBody PhanCongGiangDay phanCongGiangDay) {
        return ResponseEntity.ok(phanCongGiangDayService.save(phanCongGiangDay));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhanCongGiangDay> update(@PathVariable Integer id, @RequestBody PhanCongGiangDay phanCongGiangDay) {
        if (phanCongGiangDayService.getById(id) != null) {
            phanCongGiangDay.setId(id);
            return ResponseEntity.ok(phanCongGiangDayService.save(phanCongGiangDay));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (phanCongGiangDayService.getById(id) != null) {
            phanCongGiangDayService.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 