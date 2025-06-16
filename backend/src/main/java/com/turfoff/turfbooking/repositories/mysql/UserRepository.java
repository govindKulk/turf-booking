package com.turfoff.turfbooking.repositories.mysql;

import com.turfoff.turfbooking.domain.mysql.entities.UserEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity us SET us.password = :newPassword WHERE us.username = :username")
    void updatePassword(String username, String newPassword);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity us SET us.email = :newEmail WHERE us.username = :username")
    void updateEmail(String username, String newEmail);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity us SET us.phone = :newPhone WHERE us.username = :username")
    void updatePhone(String username, String newPhone);
}
