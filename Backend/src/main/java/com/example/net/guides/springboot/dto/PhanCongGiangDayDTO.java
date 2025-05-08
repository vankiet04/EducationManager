package com.example.net.guides.springboot.dto;

import lombok.Data;

@Data
public class PhanCongGiangDayDTO {
    private Integer id;
    private Integer nhomId;
    private Integer giangVienId;
    private String vaiTro;
    private Integer soTiet;
} 