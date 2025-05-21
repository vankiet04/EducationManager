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
@Table(name = "ctdt_phanconggiangday")
public class PhanCongGiangDay {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nhom_id")
    private Integer nhomId;

    @Column(name = "giang_vien_id")
    private Integer giangVienId;

    @Column(name = "vai_tro", length = 50)
    private String vaiTro;

    @Column(name = "so_tiet")
    private Integer soTiet;
} 