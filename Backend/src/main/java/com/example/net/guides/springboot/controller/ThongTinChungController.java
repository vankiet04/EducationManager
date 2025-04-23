package com.example.net.guides.springboot.controller;

import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.model.ThongTinChung;
import com.example.net.guides.springboot.service.ThongTinChungService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/thongTinChung")
public class ThongTinChungController{
    
    @Autowired
    private ThongTinChungService ttcService;


    @GetMapping()
    public List<ThongTinChung> getAll() {
        return ttcService.getAll();
    }


    @GetMapping("/paging")
    public Page<ThongTinChung> getAllPaging(int page, int size){
        return ttcService.getAllPaging(page, size);
    }


    @GetMapping("/{id}")
    public Optional<ThongTinChung> getById(@PathVariable int id) {
        return ttcService.getById(id);
    }

    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody ThongTinChung ttc) {
        if (ttcService.existsByMaCtdt(ttc.getMaCtdt())) {
            return ResponseEntity.badRequest().body("Mã CTDT đã tồn tại");
        }
        return ResponseEntity.ok(ttcService.save(ttc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id,@Valid @RequestBody ThongTinChung ttc){
        return ttcService.getById(id)
                .map(existingTtc -> {
                    ttc.setId(id);
                    return ResponseEntity.ok(ttcService.save(ttc));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        Optional<ThongTinChung> cur = ttcService.getById(id);
        if ( cur.isPresent()){
            ThongTinChung res = cur.get();
            res.setTrangThai(0);
            ttcService.update(res);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


}
