package com.example.net.guides.springboot.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.net.guides.springboot.model.HocPhan;

import java.util.List;
import java.util.Optional;

@Repository
public interface HocPhanRepository extends JpaRepository<HocPhan, Integer> {

    
    List<HocPhan> findByTrangThaiIsFalse();

    Page<HocPhan> findByTrangThaiIsFalse(Pageable pageable);

    Optional<HocPhan> findByIdAndTrangThaiIsFalse(Integer id);
}
