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
@Table(name = "phanconggiangday")
public class PhanCongGiangDay {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "nhom_id")
    private KeHoachMonHom nhom;

    @ManyToOne
    @JoinColumn(name = "giang_vien_id")
    private GiangVien giangVien;

    @Column(name = "vai_tro", length = 50)
    private String vaiTro;

    @Column(name = "so_tiet")
    private Integer soTiet;
} 