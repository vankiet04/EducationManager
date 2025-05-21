package com.example.net.guides.springboot.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.net.guides.springboot.model.GiangVien;
import com.example.net.guides.springboot.model.Role;
import com.example.net.guides.springboot.model.User;
import com.example.net.guides.springboot.repository.GiangVienRepository;
import com.example.net.guides.springboot.repository.RoleRepository;
import com.example.net.guides.springboot.repository.UserRepository;

@Service
public class GiangVienService {
      @Autowired
    private GiangVienRepository giangVienRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    public List<GiangVien> getAll() {
        return giangVienRepository.findAll();
    }

    public GiangVien getById(Integer id) {
        return giangVienRepository.findById(id).orElse(null);
    }

    public GiangVien getByMaGiangVien(String maGiangVien) {
        return giangVienRepository.findByMaGiangVien(maGiangVien);
    }

    public List<GiangVien> getByHoTen(String hoTen) {
        return giangVienRepository.findByHoTenContaining(hoTen);
    }

    public GiangVien getByUserId(Integer userId) {
        return giangVienRepository.findByUserId(userId);
    }

    public List<GiangVien> getByKhoa(String khoa) {
        return giangVienRepository.findByKhoa(khoa);
    }

    public List<GiangVien> getByBoMon(String boMon) {
        return giangVienRepository.findByBoMon(boMon);
    }

    @Transactional
    public GiangVien save(GiangVien giangVien) {
        try {
            // Validate required fields
            if (giangVien.getMaGiangVien() == null || giangVien.getMaGiangVien().isEmpty()) {
                throw new RuntimeException("Mã giảng viên không được để trống");
            }
            
            if (giangVien.getHoTen() == null || giangVien.getHoTen().isEmpty()) {
                throw new RuntimeException("Họ tên không được để trống");
            }
            
            // Set default value for trangThai if null
            if (giangVien.getTrangThai() == null) {
                giangVien.setTrangThai(1); // Default to active
            }
            
            System.out.println("Processing lecturer save - ID: " + giangVien.getId() + ", UserId: " + giangVien.getUserId());
            
            // If this is a new lecturer
            if (giangVien.getId() == null) {
                return handleNewLecturer(giangVien);
            } else {
                return handleExistingLecturer(giangVien);
            }

        } catch (RuntimeException e) {
            System.err.println("Runtime error in save(): " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Unexpected error in save(): " + e.getMessage());
            throw new RuntimeException("Lỗi khi lưu thông tin giảng viên: " + e.getMessage(), e);
        }
    }

    private GiangVien handleNewLecturer(GiangVien giangVien) {
        // Check if maGiangVien is already taken
        GiangVien existingLecturer = giangVienRepository.findByMaGiangVien(giangVien.getMaGiangVien());
        if (existingLecturer != null) {
            throw new RuntimeException("Mã giảng viên đã tồn tại");
        }
        
        // Handle user assignment if provided
        if (giangVien.getUserId() != null) {
            handleNewUserAssignment(giangVien.getUserId());
        }
        
        // Save and verify the new lecturer
        GiangVien savedLecturer = giangVienRepository.save(giangVien);
        System.out.println("New lecturer saved - ID: " + savedLecturer.getId() + ", UserId: " + savedLecturer.getUserId());
        return verifyAndReturnSave(savedLecturer.getId());
    }    private void handleNewUserAssignment(Integer userId) {
        // Verify the user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Check if already assigned
        GiangVien existingWithUser = giangVienRepository.findByUserId(userId);
        if (existingWithUser != null) {
            throw new RuntimeException("Người dùng đã được gán cho giảng viên khác");
        }        // Update user's role and roles collection
        user.setVaiTro("1"); // Use role ID as string for GIANG_VIEN
        Set<Role> roles = user.getRoles();
        roles.clear();
        Role lecturerRole = roleRepository.findById(1L).orElse(null);
        if (lecturerRole != null) {
            roles.add(lecturerRole);
        }
        user.setRoles(roles);
        userRepository.save(user);
        System.out.println("Updated new user role to GIANG_VIEN - UserId: " + userId);
    }private GiangVien handleExistingLecturer(GiangVien giangVien) {
        // Get existing lecturer
        GiangVien existingLecturer = giangVienRepository.findById(giangVien.getId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy giảng viên để cập nhật"));

        System.out.println("Updating lecturer - Current UserId: " + existingLecturer.getUserId() + ", New UserId: " + giangVien.getUserId());

        // Check if trying to use existing maGiangVien of another lecturer
        GiangVien existingWithCode = giangVienRepository.findByMaGiangVien(giangVien.getMaGiangVien());
        if (existingWithCode != null && !existingWithCode.getId().equals(giangVien.getId())) {
            throw new RuntimeException("Mã giảng viên đã tồn tại");
        }

        // Handle user assignment changes if any
        // Case 1: When changing from one userId to another
        // Case 2: When assigning a userId to a lecturer that previously had none (from Excel import)
        if (giangVien.getUserId() != null) {
            // Check if the new userId is already assigned to another lecturer
            GiangVien existingWithUser = giangVienRepository.findByUserId(giangVien.getUserId());
            if (existingWithUser != null && !existingWithUser.getId().equals(giangVien.getId())) {
                throw new RuntimeException("Người dùng đã được gán cho giảng viên khác");
            }

            // Handle the user role change
            User newUser = userRepository.findById(giangVien.getUserId())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));            // Update both vaiTro and roles for new user
            newUser.setVaiTro("1"); // Use role ID as string
            Set<Role> roles = newUser.getRoles();
            roles.clear();
            Role lecturerRole = roleRepository.findById(1L).orElse(null);
            if (lecturerRole != null) {
                roles.add(lecturerRole);
            }
            newUser.setRoles(roles);
            userRepository.save(newUser);
            System.out.println("Updated new user role to GIANG_VIEN - UserId: " + giangVien.getUserId());

            // If there was a previous user, handle their role
            if (existingLecturer.getUserId() != null && !existingLecturer.getUserId().equals(giangVien.getUserId())) {
                User oldUser = userRepository.findById(existingLecturer.getUserId()).orElse(null);
                if (oldUser != null) {
                    oldUser.setVaiTro("2"); // Use role ID as string for USER
                    Set<Role> oldUserRoles = oldUser.getRoles();
                    oldUserRoles.clear();
                    roleRepository.findById(2L).ifPresent(oldUserRoles::add); // Add USER role
                    oldUser.setRoles(oldUserRoles);
                    userRepository.save(oldUser);
                    System.out.println("Reverted old user role to USER - UserId: " + existingLecturer.getUserId());
                }
            }
        }

        // Update user ID first
        existingLecturer.setUserId(giangVien.getUserId());

        // Update other fields
        existingLecturer.setMaGiangVien(giangVien.getMaGiangVien());
        existingLecturer.setHoTen(giangVien.getHoTen());
        existingLecturer.setBoMon(giangVien.getBoMon());
        existingLecturer.setKhoa(giangVien.getKhoa());
        existingLecturer.setTrinhDo(giangVien.getTrinhDo());
        existingLecturer.setChuyenMon(giangVien.getChuyenMon());
        existingLecturer.setTrangThai(giangVien.getTrangThai());

        // Save and verify
        GiangVien savedLecturer = giangVienRepository.save(existingLecturer);
        System.out.println("Existing lecturer updated - ID: " + savedLecturer.getId() + ", UserId: " + savedLecturer.getUserId());
        return verifyAndReturnSave(savedLecturer.getId());
    }    @Transactional
    private void handleUserAssignmentChange(GiangVien lecturer, Integer newUserId) {
        Integer oldUserId = lecturer.getUserId();
        System.out.println("Processing user assignment change - Old: " + oldUserId + ", New: " + newUserId);

        // Handle removing old user assignment
        if (oldUserId != null) {
            User oldUser = userRepository.findById(oldUserId).orElse(null);
            if (oldUser != null) {                // Update both vaiTro and roles
                oldUser.setVaiTro("2"); // Use role ID as string
                Set<Role> userRoles = oldUser.getRoles();
                userRoles.clear();
                Role userRole = roleRepository.findById(2L).orElse(null);
                if (userRole != null) {
                    userRoles.add(userRole);
                }
                oldUser.setRoles(userRoles);
                userRepository.save(oldUser);
                System.out.println("Reverted old user role to USER - UserId: " + oldUserId);
            }
        }

        // Handle new user assignment
        if (newUserId != null) {
            // Verify new user exists and is available
            User newUser = userRepository.findById(newUserId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // Check if already assigned to another lecturer
            GiangVien existingWithUser = giangVienRepository.findByUserId(newUserId);
            if (existingWithUser != null && !existingWithUser.getId().equals(lecturer.getId())) {
                throw new RuntimeException("Người dùng đã được gán cho giảng viên khác");
            }

            // Update new user's role
            if (!"GIANG_VIEN".equals(newUser.getVaiTro())) {
                newUser.setVaiTro("GIANG_VIEN");
                userRepository.save(newUser);
                System.out.println("Updated new user role to GIANG_VIEN - UserId: " + newUserId);
            }
        }

        // Update the lecturer's userId
        lecturer.setUserId(newUserId);
        System.out.println("Updated lecturer UserId to: " + newUserId);
    }

    private GiangVien verifyAndReturnSave(Integer id) {
        GiangVien verifiedLecturer = giangVienRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không thể xác minh giảng viên sau khi lưu"));
            
        System.out.println("Verified saved lecturer - ID: " + verifiedLecturer.getId() + ", UserId: " + verifiedLecturer.getUserId());
        return verifiedLecturer;
    }

    @Transactional
    public GiangVien assignUserToLecturer(Integer lecturerId, Integer userId) {
        GiangVien giangVien = giangVienRepository.findById(lecturerId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (giangVien != null && user != null) {
            // Check if this user is already assigned to another lecturer
            GiangVien existingGiangVien = giangVienRepository.findByUserId(userId);
            if (existingGiangVien != null && !existingGiangVien.getId().equals(lecturerId)) {
                throw new RuntimeException("User đã được gán cho một giảng viên khác!");
            }
            
            // Update user role to GIANG_VIEN if not already set
            if (!"GIANG_VIEN".equals(user.getVaiTro())) {
                user.setVaiTro("GIANG_VIEN");
                userRepository.save(user);
            }
            
            giangVien.setUserId(userId);
            return giangVienRepository.save(giangVien);
        }
        
        return null;
    }

    @Transactional
    public GiangVien delete(Integer id) {
        GiangVien giangVien = giangVienRepository.findById(id).orElse(null);
        if (giangVien != null) {
            giangVien.setTrangThai(0);
            return giangVienRepository.save(giangVien);
        }
        return null;
    }
    
    @Transactional
    public GiangVien removeUserFromLecturer(Integer lecturerId) {
        GiangVien giangVien = giangVienRepository.findById(lecturerId).orElse(null);
        
        if (giangVien != null && giangVien.getUserId() != null) {
            Integer userId = giangVien.getUserId();
            giangVien.setUserId(null);
            giangVienRepository.save(giangVien);
            
            // Optionally change the user's role back if needed
            /*
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setVaiTro("NGUOI_DUNG");
                userRepository.save(user);
            }
            */
            
            return giangVien;
        }
        
        return null;
    }

    public List<String> getAllLecturerCodes() {
        // Fetch all lecturer codes, including those with trangThai = 0
        List<GiangVien> allLecturers = giangVienRepository.findAll();
        return allLecturers.stream()
                .filter(gv -> gv.getMaGiangVien() != null && !gv.getMaGiangVien().isEmpty())
                .map(GiangVien::getMaGiangVien)
                .collect(Collectors.toList());
    }
}