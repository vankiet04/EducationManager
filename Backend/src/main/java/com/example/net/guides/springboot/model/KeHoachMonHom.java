package com.example.net.guides.springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.sql.Date;

@Data
@Entity
@Table(name = "kehoachmonhom")
public class KeHoachMonHom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_nhom", length = 20)
    private String maNhom;

    @ManyToOne
    @JoinColumn(name = "hoc_phan_id")
    private HocPhan hocPhan;

    @Column(name = "nam_hoc", length = 20)
    private String namHoc;

    @Column(name = "hoc_ky")
    private Integer hocKy;

    @Column(name = "so_luong_sv")
    private Integer soLuongSv;

    @Column(name = "thoi_gian_bat_dau")
    private Date thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc")
    private Date thoiGianKetThuc;

    @Column(name = "trang_thai")
    private Integer trangThai;
} 