package com.example.net.guides.springboot.repository;

import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.NhomKienThuc;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface NhomKienThucRepository extends JpaRepository<NhomKienThuc, Integer> {

/*
    findAll, findById, save(nếu có Entity thì sẽ tự update), deleteById, count đã có sẵn từ JPA

 */

 

 




    
}
