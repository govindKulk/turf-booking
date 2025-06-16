package com.turfoff.turfbooking.controllers;

import com.turfoff.turfbooking.domain.mongo.dto.TurfDto;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.domain.mysql.dto.AdminDto;
import com.turfoff.turfbooking.domain.mysql.dto.AdminLoginDto;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.jwt.JwtUtils;
import com.turfoff.turfbooking.mappers.impl.AdminMapperImpl;
import com.turfoff.turfbooking.mappers.impl.TurfMapperImpl;
import com.turfoff.turfbooking.services.AdminService;
import com.turfoff.turfbooking.services.TurfService;
import com.turfoff.turfbooking.utilities.Roles;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.ErrorResponse;
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
    private TurfService turfService;

    @Autowired
    private TurfMapperImpl turfMapper;

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
        adminDto.setRole(Roles.ROLE_ADMIN);
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

    @PostMapping("/signin")
    public ResponseEntity<?> adminSignIn(@Valid @RequestBody AdminLoginDto adminLoginDto) {
        try {
            // Create authentication token
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            adminLoginDto.getUsername(),
                            adminLoginDto.getPassword()
                    );

            // Authenticate admin
            Authentication authentication = authenticationManager.authenticate(authToken);

            // Set security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get admin details
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();

            // Generate JWT token
            String jwtToken = jwtUtils.generateJwtTokenFromUsername(userDetails);

            // Get admin roles
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Get admin entity
            Optional<AdminEntity> adminEntity = adminService.getAdminByUsername(username);
            if (adminEntity.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Admin not found");
            }

            Long adminId = adminEntity.get().getId();

            // Log successful admin login

            AdminDto adminDto = adminMapper.mapTo(adminEntity.get());
            adminDto.setToken(jwtToken);
            return ResponseEntity.ok(adminDto);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Admin Credentials");

        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("admin  account disabled");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("login failed please try again later.");
        }
    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ROLE_ADMIN')")
    @GetMapping("/turfs/{adminId}") // Corrected path variable syntax
    public List<TurfDto> getAdminTurfs(@PathVariable("adminId") String adminId){ // Corrected to @PathVariable
        System.out.println("Fetching turfs for adminId: " + adminId); // Added a more meaningful print statement
        List<TurfEntity> turfs = turfService.getAllTurfsByAdmin(adminId);
        List<TurfDto> turfDtos = turfs.stream().map(turf -> turfMapper.mapTo(turf)).toList();
        System.out.println(turfs.toString() + " " + turfDtos.toString());
        return turfDtos;
    }

}

