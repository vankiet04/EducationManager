package com.example.net.guides.springboot.controller;

import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
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

import com.example.net.guides.springboot.model.NhomKienThuc;
import com.example.net.guides.springboot.service.NhomKienThucService;

@RestController
@RequestMapping("/api/nhomkienthuc")
@CrossOrigin("*")
public class NhomKienThucController {
    
    @Autowired
    private NhomKienThucService nhomKienThucService;


    @GetMapping("/paging")
    public ResponseEntity<Page<NhomKienThuc>> getAllPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(nhomKienThucService.getAllPaging(page, size));
    }


    @GetMapping
    public ResponseEntity<List<NhomKienThuc>> getAll() {
        List<NhomKienThuc> list = nhomKienThucService.getAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhomKienThuc> getById(@PathVariable int id){
        return nhomKienThucService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public ResponseEntity<NhomKienThuc> create(@RequestBody NhomKienThuc nkt){
        // Ensure it's a new record
        nkt.setId(null);
        // Set default active status
        if (nkt.getTrangThai() == null) {
            nkt.setTrangThai(1);
        }
        NhomKienThuc savedNkt = nhomKienThucService.save(nkt);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNkt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody NhomKienThuc nkt){
        Optional<NhomKienThuc> existingNkt = nhomKienThucService.getById(id);
        if (!existingNkt.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Nhóm kiến thức không tồn tại hoặc đã bị xóa");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        
        nkt.setId(id);
        NhomKienThuc updatedNkt = nhomKienThucService.save(nkt);
        return ResponseEntity.ok(updatedNkt);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        boolean deleted = nhomKienThucService.delete(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa nhóm kiến thức thành công");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Nhóm kiến thức không tồn tại");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
