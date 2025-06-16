package com.turfoff.turfbooking.controllers;

import com.turfoff.turfbooking.domain.mysql.dto.AdminDto;
import com.turfoff.turfbooking.domain.mysql.dto.AdminLoginDto;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.jwt.JwtUtils;
import com.turfoff.turfbooking.mappers.impl.AdminMapperImpl;
import com.turfoff.turfbooking.services.AdminService;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/admin")
@Hidden
public class AdminController {

    private AdminService adminService;
    private AdminMapperImpl adminMapper;
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AdminController(AdminService adminService, AdminMapperImpl adminMapper) {
        this.adminService = adminService;
        this.adminMapper = adminMapper;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @GetMapping(path = "/{id}")
    public ResponseEntity<AdminDto> getAdmin(@PathVariable Long id) {
        Optional<AdminEntity> adminRecord = adminService.findAdmin(id);
        return adminRecord.map(adminEntity -> {
            AdminDto adminDto = adminMapper.mapTo(adminEntity);
            return new ResponseEntity<>(adminDto, HttpStatus.OK);
        }).orElse(
                new ResponseEntity<>(HttpStatus.NOT_FOUND)
        );
    }

    @PostMapping(path = "/new")
    public ResponseEntity<AdminDto> createAdmin(@RequestBody AdminDto adminDto) {
        adminDto.setPassword(passwordEncoder.encode(adminDto.getPassword()));
        AdminEntity adminEntity = adminMapper.mapFrom(adminDto);
        AdminEntity savedAdmin = adminService.saveAdmin(adminEntity);
        return new ResponseEntity<>(adminMapper.mapTo(savedAdmin), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @PatchMapping(path = "/updatePassword")
    public ResponseEntity changeAdminPassword(@RequestBody AdminDto adminDto) {
        adminDto.setPassword(passwordEncoder.encode(adminDto.getPassword()));
        adminService.updatePassword(adminDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @PatchMapping(path = "/updatePhoneNumber")
    public ResponseEntity changeAdminPhoneNumber(@RequestBody AdminDto adminDto) {
        adminService.updatePhoneNumber(adminDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/signin")
    public ResponseEntity signinAdmin(@RequestBody AdminLoginDto adminLoginDto) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(adminLoginDto.getEmail(), adminLoginDto.getPassword()));
        }
        catch (Exception e) {
            System.out.println(e);
            Map<String, Object> map = new HashMap<>();
            map.put("message", "Bad Credentials");
            map.put("status", false);
            return new ResponseEntity<>(map, HttpStatus.UNAUTHORIZED);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateJwtTokenFromUsername(userDetails);
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority()).collect(Collectors.toList());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", HttpStatus.ACCEPTED);
        responseData.put("roles", roles);
        responseData.put("jwtToken", jwtToken);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

}
