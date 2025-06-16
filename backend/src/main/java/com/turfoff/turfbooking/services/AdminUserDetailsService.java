package com.turfoff.turfbooking.services;

import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.repositories.mysql.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AdminEntity> adminOpt = adminRepository.findByUsername(username);

        if (adminOpt.isEmpty()) {
            throw new UsernameNotFoundException("Admin not found: " + username);
        }

        AdminEntity admin = adminOpt.get();

        return User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword()) // Must be BCrypt encode
                .authorities("ROLE_ADMIN")
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
