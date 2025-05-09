package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.model.KhungChuongTrinh;
import com.example.net.guides.springboot.model.NhomKienThuc;
import com.example.net.guides.springboot.service.KhungChuongTrinhService;

@RestController
@RequestMapping("/api/khungchuongtrinh")
public class KhungChuongTrinhController {

    @Autowired
    private KhungChuongTrinhService khungChuongTrinhService;

    @GetMapping
    public ResponseEntity<List<KhungChuongTrinh>> getAll() {
        List<KhungChuongTrinh> list = khungChuongTrinhService.getAll();
        return ResponseEntity.ok(list);
    }


    @GetMapping("/paging")
    public ResponseEntity<Page<KhungChuongTrinh>> getAllPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(khungChuongTrinhService.getAllPaging(page, size));
    }   
    
    @GetMapping("/{id}")
    public ResponseEntity<List<KhungChuongTrinh>> getById(@PathVariable int id){
        List<KhungChuongTrinh> list = khungChuongTrinhService.getByCTDT(id);
        return ResponseEntity.ok(list);
    }  
    


}
