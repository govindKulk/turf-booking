package com.turfoff.turfbooking.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CombinedUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private AdminUserDetailsService adminUserDetailsService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to load as regular user first
        try {
            return customUserDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            // If user not found, try to load as admin
            try {
                return adminUserDetailsService.loadUserByUsername(username);
            } catch (UsernameNotFoundException adminException) {
                // If neither found, throw exception
                throw new UsernameNotFoundException("User not found: " + username);
            }
        }
    }
}