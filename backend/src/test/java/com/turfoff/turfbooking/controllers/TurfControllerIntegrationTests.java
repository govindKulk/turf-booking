package com.turfoff.turfbooking.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turfoff.turfbooking.TestDataUtil;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.jwt.JwtUtils;
import com.turfoff.turfbooking.repositories.mysql.AdminRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class TurfControllerIntegrationTests {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    public void testThatTurfSuccessfulTurfCreationReturns201() throws Exception {

        AdminEntity admin = TestDataUtil.createTestAdminA();
        AdminEntity savedAdminEntity = adminRepository.save(admin);

        final String TOKEN = jwtUtils.generateJwtTokenFromUsernameWithUsernameString(savedAdminEntity.getEmail());
        final String bearerToken = "Bearer " + TOKEN;
        if (TOKEN == null || TOKEN.trim().isEmpty()) {
            Assertions.fail("Token generation returned null while creating turf");
        }

        TurfEntity turf = TestDataUtil.createTestTurfEntity(savedAdminEntity.getId());
        String inputBody = objectMapper.writeValueAsString(turf);

        mockMvc.perform(
                MockMvcRequestBuilders.post("/turf/createTurf")
                        .header("Authorization", bearerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inputBody)
        ).andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

}
