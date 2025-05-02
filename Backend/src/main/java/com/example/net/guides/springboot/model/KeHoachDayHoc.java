package com.example.net.guides.springboot.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "kehoachdayhoc")
public class KeHoachDayHoc {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @NotNull(message = "CTDT không được để trống")
    @ManyToOne
    @JoinColumn(name = "ctdt_id")
    private ThongTinChung thongTinChung;

    @NotNull(message = "Học phần không được để trống")
    @ManyToOne
    @JoinColumn(name = "hoc_phan_id")
    private HocPhan hoc_phan_id;


    @NotNull(message = "Học kỳ không được để trống")
    @Column(name = "hoc_ky")
    private Integer hocKy;

    @NotNull(message = "Năm học không được để trống")
    @Column(name = "nam_hoc")
    private Integer namHoc;
}
