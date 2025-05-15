package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.DecuongChiTietDTO;
import com.example.net.guides.springboot.service.DecuongChiTietService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decuongchitiet")
@CrossOrigin("*")
public class DecuongChiTietController {

    @Autowired
    private DecuongChiTietService decuongService;

    @GetMapping
    public ResponseEntity<List<DecuongChiTietDTO>> findAll() {
        List<DecuongChiTietDTO> decuongs = decuongService.findAll();
        return ResponseEntity.ok(decuongs);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<DecuongChiTietDTO>> findAllPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<DecuongChiTietDTO> decuongs = decuongService.findAllPaging(page, size);
        return ResponseEntity.ok(decuongs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DecuongChiTietDTO> findById(@PathVariable Integer id) {
        return decuongService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/hocphan/{hocPhanId}")
    public ResponseEntity<List<DecuongChiTietDTO>> findByHocPhanId(@PathVariable Integer hocPhanId) {
        List<DecuongChiTietDTO> decuongs = decuongService.findByHocPhanId(hocPhanId);
        return ResponseEntity.ok(decuongs);
    }

    @PostMapping
    public ResponseEntity<DecuongChiTietDTO> create(@Valid @RequestBody DecuongChiTietDTO decuongDto) {
        DecuongChiTietDTO createdDecuong = decuongService.create(decuongDto);
        return ResponseEntity.ok(createdDecuong);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DecuongChiTietDTO> update(
            @PathVariable Integer id,
            @Valid @RequestBody DecuongChiTietDTO decuongDto) {
        if (!id.equals(decuongDto.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return decuongService.update(decuongDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = decuongService.delete(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 