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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Getter
@Setter

@Table(name = "score")
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    
    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "decuong_id")
    private OutlineDetail outlineDetail;
    
    @Column(name = "ten_cot_diem", nullable = false, length = 100)
    private String tenCotDiem;

    @Column(name = "ty_le_phan_tram", nullable = false)
    private Float tyLePhanTram;
    
    @Column(name = "hinh_thuc", length = 100)
    private String hinhThuc;
}