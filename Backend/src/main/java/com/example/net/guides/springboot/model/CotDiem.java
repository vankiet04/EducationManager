package com.example.net.guides.springboot.model;

import java.math.BigDecimal;

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
@Table(name = "cotdiem")
public class CotDiem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "decuong_id")
    private DecuongChiTiet decuongChiTiet;
    
    @Column(name = "ten_cot_diem", length = 100, nullable = false)
    private String tenCotDiem;
    
    @Column(name = "ty_le_phan_tram", precision = 5, scale = 2, nullable = false)
    private BigDecimal tyLePhanTram;
    
    @Column(name = "hinh_thuc", length = 100)
    private String hinhThuc;
} 