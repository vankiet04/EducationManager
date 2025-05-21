package com.example.net.guides.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.KeHoachDayHoc;

@Repository
public interface KeHoachDayHocRepository extends JpaRepository<KeHoachDayHoc, Integer> {

    List<KeHoachDayHoc> findByNamHocAndHocKy(Integer namHoc, Integer hocKy);

}
