package com.example.net.guides.springboot.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class CotDiemDTO {
    private Integer id;
    private Integer decuongId;
    private String tenCotDiem;
    private BigDecimal tyLePhanTram;
    private String hinhThuc;
} 