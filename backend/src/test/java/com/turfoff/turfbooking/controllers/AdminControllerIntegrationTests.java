//package com.turfoff.turfbooking.controllers;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.turfoff.turfbooking.TestDataUtil;
//import com.turfoff.turfbooking.domain.dto.AdminDto;
//import com.turfoff.turfbooking.domain.entities.AdminEntity;
//import com.turfoff.turfbooking.mappers.impl.AdminMapperImpl;
//import com.turfoff.turfbooking.services.AdminService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.test.annotation.DirtiesContext;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
//
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.junit.jupiter.api.Assertions.fail;
//
//import java.util.Optional;
//
//@SpringBootTest
//@ExtendWith(SpringExtension.class)
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//@AutoConfigureMockMvc
//public class AdminControllerIntegrationTests {
//
//    @Value("${com.turfoff.turfbooking.api-key.key}")
//    private String principalRequestHeader;
//
//    @Value("${com.turfoff.turfbooking.api-key.value}")
//    private String principalRequestValue;
//
//    private AdminService adminService;
//    private MockMvc mockMvc;
//    private ObjectMapper objectMapper;
//    private BCryptPasswordEncoder passwordEncoder;
//    @Autowired
//    private AdminMapperImpl adminMapperImpl;
//
//    @Autowired
//    public AdminControllerIntegrationTests(AdminService adminService, MockMvc mockMvc) {
//        this.adminService = adminService;
//        this.mockMvc = mockMvc;
//        this.passwordEncoder = new BCryptPasswordEncoder();
//        this.objectMapper = new ObjectMapper();
//    }
//
//    @Test
//    public void testThatCreateAdminSuccessfullyReturnsHttp201Created() throws Exception {
//        AdminDto testAdminDto = TestDataUtil.createTestAdminDto();
//        String testAdminAJson = objectMapper.writeValueAsString(testAdminDto);
//
//        mockMvc.perform(
//                MockMvcRequestBuilders.post("/admin/")
//                        .header(principalRequestHeader, principalRequestValue)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(testAdminAJson)
//        ).andExpect(
//                MockMvcResultMatchers.status().isCreated()
//        );
//    }
//
//    @Test
//    public void testThatUpdateAdminPasswordReturnsStatus200() throws Exception {
//        AdminDto adminDto = TestDataUtil.createTestAdminDto();
//        String testAdminDtoString = objectMapper.writeValueAsString(adminDto);
//        mockMvc.perform(
//                MockMvcRequestBuilders.patch("/admin/updatePassword")
//                        .header(principalRequestHeader, principalRequestValue)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(testAdminDtoString)
//        ).andExpect(
//                MockMvcResultMatchers.status().isOk()
//        );
//    }
//
//    @Test
//    public void testThatUpdateAdminPasswordUpdatesThePassword() throws Exception {
//        String newPassword = "updatedPassword";
//        AdminEntity adminEntity = TestDataUtil.createTestAdminA();
//        adminService.saveAdmin(adminEntity);
//        adminEntity.setPassword(newPassword);
//        AdminDto adminDto = adminMapperImpl.mapTo(adminEntity);
//        String adminAJson = objectMapper.writeValueAsString(adminDto);
//        mockMvc.perform(
//                MockMvcRequestBuilders.patch("/admin/updatePassword")
//                        .header(principalRequestHeader, principalRequestValue)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(adminAJson)
//        );
//        Optional<AdminEntity> admin = adminService.findAdmin(adminEntity.getId());
//        if (admin.isPresent()) {
//            assertTrue(passwordEncoder.matches(newPassword, admin.get().getPassword()));
//        }
//        else {
//            fail("admin was not found after the password update was made.");
//        }
//
//    }
//
//}
