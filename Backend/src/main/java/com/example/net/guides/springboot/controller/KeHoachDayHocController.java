package com.example.net.guides.springboot.controller;

import java.util.List;

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

import com.example.net.guides.springboot.dto.KeHoachDayHocDTO;
import com.example.net.guides.springboot.dto.KeHoachDayHocDTO;
import com.example.net.guides.springboot.dto.KeHoachDayHocDTO;
import com.example.net.guides.springboot.service.KeHoachDayHocService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/KeHoachDayHoc")
public class KeHoachDayHocController {
    
    @Autowired
    private KeHoachDayHocService keHoachDayHocService;


    @GetMapping
    public ResponseEntity<List<KeHoachDayHocDTO>> findAll() {
        List<KeHoachDayHocDTO> khdh = keHoachDayHocService.findAll();
        return ResponseEntity.ok(khdh);
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<KeHoachDayHocDTO>> findAllPaging(@RequestParam int page, @RequestParam int size) {
        Page<KeHoachDayHocDTO> khdh = keHoachDayHocService.findAllPaging(page, size);
        return ResponseEntity.ok(khdh);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KeHoachDayHocDTO> findById(@PathVariable int id) {
        return keHoachDayHocService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<KeHoachDayHocDTO> create(@Valid @RequestBody KeHoachDayHocDTO cur) {
        KeHoachDayHocDTO khdh = keHoachDayHocService.create(cur);
        return ResponseEntity.ok(khdh);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KeHoachDayHocDTO> update(@PathVariable int id,@Valid @RequestBody KeHoachDayHocDTO cur) {
        return keHoachDayHocService.update(cur)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        keHoachDayHocService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<KeHoachDayHocDTO>> search(
            @RequestParam Integer namHoc,
            @RequestParam Integer hocKy) {
        List<KeHoachDayHocDTO> khdh = keHoachDayHocService.findByNamHocAndHocKy(namHoc, hocKy);
        return ResponseEntity.ok(khdh);
    }
}
