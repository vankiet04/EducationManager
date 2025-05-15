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

@Data
@Entity
@Table(name = "khungchuongtrinh_nhomkienthuc")
public class KhungChuongTrinhNhomKienThuc {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "id_khungchuongtrinh")
    private KhungChuongTrinh khungChuongTrinh;
    
    @ManyToOne
    @JoinColumn(name = "id_manhom")
    private NhomKienThuc nhomKienThuc;
    
    @Column(name = "sotinchibatbuoc")
    private Integer soTinChiBatBuoc;
    
    @Column(name = "sotinchituchon")
    private Integer soTinChiTuChon;
} 