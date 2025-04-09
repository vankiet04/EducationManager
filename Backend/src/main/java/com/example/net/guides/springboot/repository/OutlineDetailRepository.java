package com.example.net.guides.springboot.repository;

import com.example.net.guides.springboot.model.OutlineDetail;
import com.example.net.guides.springboot.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutlineDetailRepository extends JpaRepository<OutlineDetail, Long> {
    List<OutlineDetail> findAll();

    OutlineDetail findById(Integer id);
}
    