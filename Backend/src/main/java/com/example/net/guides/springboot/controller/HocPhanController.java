package com.example.net.guides.springboot.controller;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.dto.HocPhanDTO;
import com.example.net.guides.springboot.model.HocPhan;
import com.example.net.guides.springboot.service.HocPhanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hocphan")
public class HocPhanController {

    @Autowired
    private HocPhanService hocPhanService;

    @GetMapping
    public ResponseEntity<List<HocPhanDTO>> findAll() {
        List<HocPhanDTO> hocPhan = hocPhanService.findAll();
        return ResponseEntity.ok(hocPhan);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<HocPhanDTO>> findAllPaging(@RequestParam int page, @RequestParam int size) {
        Page<HocPhanDTO> hocPhan = hocPhanService.findAllPaging(page, size);
        return ResponseEntity.ok(hocPhan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HocPhanDTO> findById(@PathVariable int id) {
        return hocPhanService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<HocPhanDTO> create(@Valid @RequestBody HocPhanDTO hocPhanDTO) {
        HocPhanDTO createdHocPhan = hocPhanService.create(hocPhanDTO);
        return ResponseEntity.ok(createdHocPhan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HocPhanDTO> update(@PathVariable int id,@Valid @RequestBody HocPhanDTO hocPhanDTO) {
        return hocPhanService.update(hocPhanDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        hocPhanService.delete(id);
        return ResponseEntity.ok().build();
    }
}