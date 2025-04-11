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
@Table(name = "khungchuongtrinh")
public class KhungChuongTrinh {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ctdt_id", length = 11)
    private Integer ctdt_id; // mã chương trình đào tạo


    @Column(name = "ma_nhom", length = 50)
    private String ma_nhom; // mã nhóm khung chương trình
    

    @Column(name = "ten_nhom", length = 255)
    private String ten_nhom; // tên nhóm khung chương trình

    @Column(name ="so_tin_chi_toi_thieu", length = 11)
    private Integer soTinChiToiThieu;

    


    
}
