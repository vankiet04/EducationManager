    package com.example.net.guides.springboot.model;

    import org.hibernate.annotations.ColumnDefault;

import jakarta.annotation.Generated;
    import jakarta.persistence.Column;
    import jakarta.persistence.Entity;
    import jakarta.persistence.GeneratedValue;
    import jakarta.persistence.GenerationType;
    import jakarta.persistence.Id;
    import jakarta.persistence.JoinColumn;
    import jakarta.persistence.OneToOne;
    import jakarta.persistence.Table;
    import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

    @Data
    @Entity
    @Table(name ="hocphan")
    public class HocPhan {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        @NotBlank(message = "Mã  học phần không để trống")
        @Column(name = "ma_hp", length = 50)
        private String maHp;

        @NotBlank(message = "Tên học phần không để trống")
        @Column(name = "ten_hp", length = 255)
        private String tenHp;

        @NotNull(message = "Số tín chỉ không để trống")
        @Column(name = "so_tin_chi", length = 11)
        private Integer soTinChi;

        @NotNull(message = "Số tiết lý thuyết không để trống")
        @Column(name = "so_tiet_ly_thuyet", length = 11)
        private Integer soTietLyThuyet;

        @NotNull(message = "Số tiết thực hành không để trống")
        @Column(name = "so_tiet_thuc_hanh", length = 11)
        private Integer soTietThucHanh;

        @OneToOne
        @JoinColumn(name = "nhom_id")
        private NhomKienThuc nhomKienThucID;

        @NotBlank(message = "Loại học phần không để trống")
        @Column(name = "loai_hp", length = 50)
        private String loaiHp;

        @Column(name = "hoc_phan_tien_quyet", length = 255)
        private String hocPhanTienQuyet;

        @Column(name = "trang_thai")
        @ColumnDefault("0")
        private Integer trangThai;
    }
