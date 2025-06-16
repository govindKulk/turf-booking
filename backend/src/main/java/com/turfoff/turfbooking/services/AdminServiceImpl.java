package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mysql.dto.AdminDto;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.repositories.mysql.AdminRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public Optional<AdminEntity> findAdmin(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public AdminEntity saveAdmin(AdminEntity adminEntity) {
        return adminRepository.save(adminEntity);
    }

    @Override
    public void updatePassword(AdminDto adminDto) {
        adminRepository.updatePassword(adminDto.getId(), adminDto.getPassword());
    }

    @Override
    public void updatePhoneNumber(AdminDto adminDto) {
        adminRepository.updatePhoneNumber(adminDto.getId(), adminDto.getPhone());
    }
}
