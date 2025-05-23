package com.example.net.guides.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.ChiTietKhungChuongTrinhDTO;
import com.example.net.guides.springboot.service.ChiTietKhungChuongtrinhService;

@RestController
@RequestMapping("/api/chitietkhungchuongtrinh")
public class ChiTietKhungChuongTrinhController {
    
    @Autowired
    private ChiTietKhungChuongtrinhService chiTietKhungChuongTrinhService;

    @GetMapping("/{id}")
    public ResponseEntity<List<ChiTietKhungChuongTrinhDTO>> getByKhungChuongTrinhId(@PathVariable int id) {
        List<ChiTietKhungChuongTrinhDTO> list = chiTietKhungChuongTrinhService.getByKhungChuongTrinhId(id);
        return ResponseEntity.ok(list);

    }
}