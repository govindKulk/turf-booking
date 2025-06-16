package com.turfoff.turfbooking.repositories.mysql;

import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    Optional<AdminEntity> findByUsername(String username);
    Optional<AdminEntity> findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE AdminEntity a SET a.password = :newPassword WHERE a.id = :id")
    void updatePassword(Long id, String newPassword);

    @Modifying
    @Transactional
    @Query("UPDATE AdminEntity a SET a.phone = :newPhoneNumber WHERE a.id = :id")
    void updatePhoneNumber(Long id, String newPhoneNumber);
}
