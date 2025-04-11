package com.example.net.guides.springboot.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
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
@Table(name = "khungchuongtrinh_nhomkienthuc")
public class ChiTietKhungChuongTrinh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_manhom")
    @JsonIgnore
    private NhomKienThuc nhomKienThuc;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khungchuongtrinh")
    @JsonIgnore
    private KhungChuongTrinh khungChuongTrinh;




    @Column(name="sotinchibatbuoc")
    private Integer soTinChiBatBuoc;
    
    @Column(name="sotinchituchon")
    private Integer soTinChiTuChon;
}
