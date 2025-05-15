package com.example.net.guides.springboot.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "decuongchitiet")
public class DecuongChiTiet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "hoc_phan_id")
    private HocPhan hocPhan;
    
    @Column(name = "muc_tieu", columnDefinition = "TEXT")
    private String mucTieu;
    
    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;
    
    @Column(name = "phuong_phap_giang_day", columnDefinition = "TEXT")
    private String phuongPhapGiangDay;
    
    @Column(name = "phuong_phap_danh_gia", columnDefinition = "TEXT")
    private String phuongPhapDanhGia;
    
    @Column(name = "tai_lieu_tham_khao", columnDefinition = "TEXT")
    private String taiLieuThamKhao;
    
    @Column(name = "trang_thai")
    private Integer trangThai;
    
    @OneToMany(mappedBy = "decuongChiTiet", fetch = FetchType.LAZY)
    private List<CotDiem> cotDiems = new ArrayList<>();
} 