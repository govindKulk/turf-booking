//package com.turfoff.turfbooking.repositories;
//
//import com.turfoff.turfbooking.TestDataUtil;
//import com.turfoff.turfbooking.domain.entities.AdminEntity;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.annotation.DirtiesContext;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//@ExtendWith(SpringExtension.class)
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//public class AdminEntityRepositoryIntegrationTests {
//
//    private AdminRepository underTest;
//
//    @Autowired
//    public AdminEntityRepositoryIntegrationTests(AdminRepository underTest) {
//        this.underTest = underTest;
//    }
//
//    @Test
//    public void testThatAdminCanBeCreatedAndRecalled() {
//        AdminEntity adminEntity = TestDataUtil.createTestAdminA();
//        underTest.save(adminEntity);
//        Optional<AdminEntity> receivedAdminEntity = underTest.findById(adminEntity.getId());
//        assertThat(receivedAdminEntity).isPresent();
//        assertThat(receivedAdminEntity.get()).isEqualTo(adminEntity);
//    }
//
//}
