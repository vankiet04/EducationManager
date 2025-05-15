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

import com.example.net.guides.springboot.dto.CotDiemDTO;
import com.example.net.guides.springboot.service.CotDiemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cotdiem")
@CrossOrigin("*")
public class CotDiemController {

    @Autowired
    private CotDiemService cotDiemService;

    @GetMapping
    public ResponseEntity<List<CotDiemDTO>> findAll() {
        List<CotDiemDTO> cotDiems = cotDiemService.findAll();
        return ResponseEntity.ok(cotDiems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CotDiemDTO> findById(@PathVariable Integer id) {
        return cotDiemService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/decuong/{decuongId}")
    public ResponseEntity<List<CotDiemDTO>> findByDecuongId(@PathVariable Integer decuongId) {
        List<CotDiemDTO> cotDiems = cotDiemService.findByDecuongId(decuongId);
        return ResponseEntity.ok(cotDiems);
    }

    @PostMapping
    public ResponseEntity<CotDiemDTO> create(@Valid @RequestBody CotDiemDTO cotDiemDto) {
        CotDiemDTO createdCotDiem = cotDiemService.create(cotDiemDto);
        return ResponseEntity.ok(createdCotDiem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CotDiemDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody CotDiemDTO cotDiemDto) {
        if (!id.equals(cotDiemDto.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return cotDiemService.update(cotDiemDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = cotDiemService.delete(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 