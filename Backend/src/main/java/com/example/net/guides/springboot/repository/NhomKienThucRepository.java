package com.example.net.guides.springboot.repository;

import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.NhomKienThuc;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface NhomKienThucRepository extends JpaRepository<NhomKienThuc, Integer> {

/*
    findAll, findById, save(nếu có Entity thì sẽ tự update), deleteById, count đã có sẵn từ JPA

 */

    // Find all active knowledge groups (trangThai != 0)
    List<NhomKienThuc> findByTrangThaiNot(Integer trangThai);
    
    // Find all active knowledge groups with pagination
    Page<NhomKienThuc> findByTrangThaiNot(Integer trangThai, Pageable pageable);
    
    // Find by ID and trangThai != 0
    Optional<NhomKienThuc> findByIdAndTrangThaiNot(Integer id, Integer trangThai);

 

 




    
}
