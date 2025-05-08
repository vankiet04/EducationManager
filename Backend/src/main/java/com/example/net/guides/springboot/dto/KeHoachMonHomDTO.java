package com.example.net.guides.springboot.dto;

import lombok.Data;
import java.util.Date;

@Data
public class KeHoachMonHomDTO {
    private Integer id;
    private Integer hocPhanId;
    private String maNhom;
    private String namHoc;
    private Integer hocKy;
    private Date thoiGianBatDau;
    private Date thoiGianKetThuc;
    private Integer soLuongSV;
    private Integer trangThai;
} 