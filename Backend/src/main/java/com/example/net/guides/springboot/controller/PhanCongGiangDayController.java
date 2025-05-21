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

import com.example.net.guides.springboot.dto.PhanCongGiangDayDTO;
import com.example.net.guides.springboot.service.PhanCongGiangDayService;

@RestController
@RequestMapping("/api/phanconggiangday")
public class PhanCongGiangDayController {

    @Autowired
    private PhanCongGiangDayService phanCongGiangDayService;

    @GetMapping
    public ResponseEntity<List<PhanCongGiangDayDTO>> getAll() {
        return ResponseEntity.ok(phanCongGiangDayService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhanCongGiangDayDTO> getById(@PathVariable Integer id) {
        PhanCongGiangDayDTO dto = phanCongGiangDayService.getById(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/nhom/{nhomId}")
    public ResponseEntity<List<PhanCongGiangDayDTO>> getByNhomId(@PathVariable Integer nhomId) {
        return ResponseEntity.ok(phanCongGiangDayService.getByNhomId(nhomId));
    }

    @GetMapping("/giangvien/{giangVienId}")
    public ResponseEntity<List<PhanCongGiangDayDTO>> getByGiangVienId(@PathVariable Integer giangVienId) {
        return ResponseEntity.ok(phanCongGiangDayService.getByGiangVienId(giangVienId));
    }

    @PostMapping
    public ResponseEntity<PhanCongGiangDayDTO> create(@RequestBody PhanCongGiangDayDTO phanCongGiangDayDTO) {
        return ResponseEntity.ok(phanCongGiangDayService.save(phanCongGiangDayDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhanCongGiangDayDTO> update(@PathVariable Integer id, @RequestBody PhanCongGiangDayDTO phanCongGiangDayDTO) {
        if (phanCongGiangDayService.getById(id) != null) {
            phanCongGiangDayDTO.setId(id);
            return ResponseEntity.ok(phanCongGiangDayService.save(phanCongGiangDayDTO));
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