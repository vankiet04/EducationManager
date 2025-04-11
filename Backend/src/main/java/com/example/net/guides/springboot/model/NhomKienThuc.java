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
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = "nhomkienthuc")
public class NhomKienThuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @Column(name = "manhom", length = 50)
    private String maNhom;


    @Column(name =  "ten_nhom", length = 255)
    private String tenNhom;


    @Column(name="trangthai", nullable = true)
    private Integer trangThai;

    @OneToMany(mappedBy = "nhomKienThuc", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChiTietKhungChuongTrinh> chiTietKhungChuongTrinhList;
    
}
