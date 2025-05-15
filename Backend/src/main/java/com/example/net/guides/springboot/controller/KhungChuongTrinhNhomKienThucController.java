package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.KhungChuongTrinhNhomKienThucDTO;
import com.example.net.guides.springboot.service.KhungChuongTrinhNhomKienThucService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/khungchuongtrinh-nhomkienthuc")
@CrossOrigin("*")
public class KhungChuongTrinhNhomKienThucController {

    @Autowired
    private KhungChuongTrinhNhomKienThucService khungNhomService;

    @GetMapping
    public ResponseEntity<List<KhungChuongTrinhNhomKienThucDTO>> findAll() {
        List<KhungChuongTrinhNhomKienThucDTO> list = khungNhomService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhungChuongTrinhNhomKienThucDTO> findById(@PathVariable Integer id) {
        return khungNhomService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/khungchuongtrinh/{khungId}")
    public ResponseEntity<List<KhungChuongTrinhNhomKienThucDTO>> findByKhungChuongTrinhId(@PathVariable Integer khungId) {
        List<KhungChuongTrinhNhomKienThucDTO> list = khungNhomService.findByKhungChuongTrinhId(khungId);
        return ResponseEntity.ok(list);
    }
    
    @GetMapping("/nhomkienthuc/{nhomId}")
    public ResponseEntity<List<KhungChuongTrinhNhomKienThucDTO>> findByNhomKienThucId(@PathVariable Integer nhomId) {
        List<KhungChuongTrinhNhomKienThucDTO> list = khungNhomService.findByNhomKienThucId(nhomId);
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<KhungChuongTrinhNhomKienThucDTO> create(@Valid @RequestBody KhungChuongTrinhNhomKienThucDTO dto) {
        KhungChuongTrinhNhomKienThucDTO created = khungNhomService.create(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhungChuongTrinhNhomKienThucDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody KhungChuongTrinhNhomKienThucDTO dto) {
        if (!id.equals(dto.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return khungNhomService.update(dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = khungNhomService.delete(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 