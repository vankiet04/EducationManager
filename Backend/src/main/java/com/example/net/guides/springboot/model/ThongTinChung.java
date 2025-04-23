package com.example.net.guides.springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "thongtinchung")
public class ThongTinChung {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @NotBlank(message = "Mã CTDT không được để trống")
    @Column(name = "ma_ctdt", length = 50)
    private String maCtdt;
    
    @NotBlank(message = "Tên CTDT không được để trống")
    @Column(name = "ten_ctdt", length = 255)
    private String tenCtdt;
    
    @NotBlank(message = "Tên ngành không được để trống")
    @Column(name = "nganh", length = 100)
    private String nganh;
    
    @NotBlank(message = "Mã ngành không được để trống")
    @Column(name = "ma_nganh", length = 50)
    private String maNganh;

    @Column(name = "khoa_quan_ly", length = 100)
    private String khoaQuanLy;

    @Column(name = "he_dao_tao", length = 50)
    private String heDaoTao;

    @Column(name = "trinh_do", length = 50)
    private String trinhDo;

    @Column(name = "tong_tin_chi", length = 11)
    private int tongTinChi;

    @Column(name = "thoi_gian_dao_tao", length = 50)
    private String thoiGianDaoTao;

    @Column(name = "nam_ban_hanh", length = 11)
    private int namBanHanh;

    
    @Column(name = "trang_thai")
    private int trangThai;
}
