package com.turfoff.turfbooking.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.turfoff.turfbooking.TestDataUtil;
import com.turfoff.turfbooking.domain.mysql.entities.UserEntity;
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
public class UserControllerIntegrationTests {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testThatSuccessfulUserCreationReturns201() throws Exception {
        UserEntity userEntity = TestDataUtil.createTestUserEntity();
        String inputObject = objectMapper.writeValueAsString(userEntity);

        mockMvc.perform(
                MockMvcRequestBuilders.post("/users/new")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inputObject)
        ).andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

}
