package com.example.net.guides.springboot.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

import com.example.net.guides.springboot.model.NhomKienThuc;
import com.example.net.guides.springboot.service.NhomKienThucService;

@RestController
@RequestMapping("/api/nhomkienthuc")
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
    public ResponseEntity create(@RequestBody NhomKienThuc nkt){
        return ResponseEntity.ok(nhomKienThucService.save(nkt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhomKienThuc> update(@PathVariable int id, @RequestBody NhomKienThuc nkt){
        if( !nhomKienThucService.getById(id).isPresent())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(nhomKienThucService.save(nkt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Optional<NhomKienThuc> op = nhomKienThucService.getById(id);
        if (!op.isPresent())
            return ResponseEntity.notFound().build();
        NhomKienThuc nkt = op.get();
        nkt.setTrangThai(0);
        nhomKienThucService.save(nkt);
        return ResponseEntity.ok().build();
    }
    


}
