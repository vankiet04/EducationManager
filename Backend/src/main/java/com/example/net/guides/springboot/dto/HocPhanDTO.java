package com.example.net.guides.springboot.dto;

import lombok.Data;

@Data
public class HocPhanDTO {
    private Integer id;
    private String maHp;
    private String tenHp;
    private Integer soTinChi;
    private Integer soTietLyThuyet;
    private Integer soTietThucHanh;
    private Integer nhomKienThucID;
    private String loaiHp;
    private String hocPhanTienQuyet;
    private Integer trangThai;
}
