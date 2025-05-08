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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.net.guides.springboot.model.KeHoachMonHom;
import com.example.net.guides.springboot.dto.KeHoachMonHomDTO;
import com.example.net.guides.springboot.service.KeHoachMonHomService;

@RestController
@RequestMapping("/api/kehoachmonhom")
public class KeHoachMonHomController {

    @Autowired
    private KeHoachMonHomService keHoachMonHomService;

    @GetMapping
    public ResponseEntity<List<KeHoachMonHomDTO>> getAll() {
        return ResponseEntity.ok(keHoachMonHomService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeHoachMonHomDTO> getById(@PathVariable Integer id) {
        KeHoachMonHomDTO dto = keHoachMonHomService.getById(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/hocphan/{hocPhanId}")
    public ResponseEntity<List<KeHoachMonHomDTO>> getByHocPhanId(@PathVariable Integer hocPhanId) {
        return ResponseEntity.ok(keHoachMonHomService.getByHocPhanId(hocPhanId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<KeHoachMonHomDTO>> getByNamHocAndHocKy(
            @RequestParam String namHoc,
            @RequestParam Integer hocKy) {
        return ResponseEntity.ok(keHoachMonHomService.getByNamHocAndHocKy(namHoc, hocKy));
    }

    @PostMapping
    public ResponseEntity<KeHoachMonHom> create(@RequestBody KeHoachMonHom keHoachMonHom) {
        return ResponseEntity.ok(keHoachMonHomService.save(keHoachMonHom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeHoachMonHom> update(@PathVariable Integer id, @RequestBody KeHoachMonHom keHoachMonHom) {
        if (keHoachMonHomService.getById(id) != null) {
            keHoachMonHom.setId(id);
            return ResponseEntity.ok(keHoachMonHomService.save(keHoachMonHom));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (keHoachMonHomService.getById(id) != null) {
            keHoachMonHomService.delete(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 