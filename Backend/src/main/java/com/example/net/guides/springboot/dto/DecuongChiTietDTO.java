package com.example.net.guides.springboot.dto;

import lombok.Data;

@Data
public class DecuongChiTietDTO {
    private Integer id;
    private Integer hocPhanId;
    private String mucTieu;
    private String noiDung;
    private String phuongPhapGiangDay;
    private String phuongPhapDanhGia;
    private String taiLieuThamKhao;
    private Integer trangThai;
} 