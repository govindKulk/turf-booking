package com.turfoff.turfbooking.domain.mysql.entities;

import com.turfoff.turfbooking.utilities.Roles;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "admins")
public class AdminEntity extends EntityBase{

    private String firstName;

    private String lastName;

    @Column(unique = true, nullable = false)
    private  String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String phone;

    private Roles role = Roles.ROLE_ADMIN;

}
