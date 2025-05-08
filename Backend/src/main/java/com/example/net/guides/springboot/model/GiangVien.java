package com.example.net.guides.springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "giangvien")
public class GiangVien {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", length = 11)
    private Integer userId;


    @Column(name = "ma_gv", length = 50)
    private String maGiangVien;

    @Column(name = "bo_mon", length = 100)
    private String boMon;

    @Column(name = "khoa", length = 100)
    private String khoa;

    @Column(name = "trinh_do", length = 50)
    private String trinhDo;

    @Column(name = "chuyen_mon", length = 100)
    private String chuyenMon;

    @Column(name = "ho_ten", length = 100)
    private String hoTen;

    @Column(name = "trang_thai")
    private Integer trangThai;
} 