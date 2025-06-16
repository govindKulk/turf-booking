package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mysql.entities.UserEntity;

import java.util.Optional;

public interface UserService {
    UserEntity saveUser(UserEntity user);
    Optional<UserEntity> getUserById(long id);
    void updatePassword(String username, String newPassword);
    void updateEmail(String username, String newEmail);
    void updatePhone(String username, String newPhone);
    Optional<UserEntity> getUserByUsername(String username);
}
