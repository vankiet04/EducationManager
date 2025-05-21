package com.example.net.guides.springboot.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.net.guides.springboot.dto.HocPhanDTO;
import com.example.net.guides.springboot.dto.KeHoachDayHocDTO;
import com.example.net.guides.springboot.model.HocPhan;
import com.example.net.guides.springboot.model.KeHoachDayHoc;
import com.example.net.guides.springboot.repository.HocPhanRepository;
import com.example.net.guides.springboot.repository.KeHoachDayHocRepository;
import com.example.net.guides.springboot.repository.ThongTinChungRepository;

@Service
public class KeHoachDayHocService {
    
    @Autowired
    private KeHoachDayHocRepository keHoachDayHocRepo;

    @Autowired
    private ThongTinChungRepository thongTinChungRepo;

    @Autowired
    private HocPhanRepository hocPhanRepo;

    private KeHoachDayHocDTO ChuyenDoiDTO(KeHoachDayHoc keHoachDayHoc) {
        KeHoachDayHocDTO dto = new KeHoachDayHocDTO();
        dto.setId(keHoachDayHoc.getId());
        dto.setCtdt_id(keHoachDayHoc.getThongTinChung().getId());
        dto.setHoc_phan_id(keHoachDayHoc.getHoc_phan_id().getId());
        dto.setHoc_ky(keHoachDayHoc.getHocKy());
        dto.setNam_hoc(keHoachDayHoc.getNamHoc());
        return dto;
    }

    private KeHoachDayHoc ChuyenDoiEntity(KeHoachDayHocDTO dto) {
        KeHoachDayHoc keHoachDayHoc = new KeHoachDayHoc();
        keHoachDayHoc.setId(dto.getId());
        keHoachDayHoc.setThongTinChung(thongTinChungRepo.findById(dto.getCtdt_id()).get());
        keHoachDayHoc.setHoc_phan_id(hocPhanRepo.findById(dto.getHoc_phan_id()).get());
        keHoachDayHoc.setNamHoc(dto.getNam_hoc());
        keHoachDayHoc.setHocKy(dto.getHoc_ky());
        return keHoachDayHoc;
    }

    public List<KeHoachDayHocDTO> findAll(){
        return keHoachDayHocRepo.findAll().stream()
                .map(this::ChuyenDoiDTO)
                .collect(Collectors.toList());
    }

    public Page<KeHoachDayHocDTO> findAllPaging(int page, int size){
        return keHoachDayHocRepo.findAll(PageRequest.of(page, size))
                .map(this::ChuyenDoiDTO);
    }

    public Optional<KeHoachDayHocDTO> findById(int id) {
        return keHoachDayHocRepo.findById(id).map(this::ChuyenDoiDTO);
    }
    public KeHoachDayHocDTO create(KeHoachDayHocDTO dto) {
        KeHoachDayHoc khdh = ChuyenDoiEntity(dto);
        keHoachDayHocRepo.save(khdh);
        return dto;
    }
    
    public Optional<KeHoachDayHocDTO> update(KeHoachDayHocDTO dto) {
        return keHoachDayHocRepo.findById(dto.getId())
                .map(e -> {
                    KeHoachDayHoc cur = ChuyenDoiEntity(dto);
                    keHoachDayHocRepo.save(cur);
                    return ChuyenDoiDTO(cur);
                });
    }
    public void delete(int id) {
        keHoachDayHocRepo.deleteById(id);

    }

    public List<KeHoachDayHocDTO> findByNamHocAndHocKy(Integer namHoc, Integer hocKy) {
        return keHoachDayHocRepo.findByNamHocAndHocKy(namHoc, hocKy)
                .stream()
                .map(this::ChuyenDoiDTO)
                .collect(Collectors.toList());
    }

}
