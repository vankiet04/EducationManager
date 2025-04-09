package com.example.net.guides.springboot.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "outline_detail")
public class OutlineDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name= "muc_tieu", nullable = false, length = 50)
    private String mucTieu;

    @Column(name = "phuong_phap_giang_day", length = 255)
    private String PPGD;

    @Column(name = "phuong_phap_danh_gia", length = 255)
    private String PPDG;

    @Column(name = "thoi_gian", nullable = false, length = 20)
    private String thoiGian;

    @JoinColumn(name = "decuong_id", nullable = false)
    private List<Score> scores = new ArrayList<>();
}

