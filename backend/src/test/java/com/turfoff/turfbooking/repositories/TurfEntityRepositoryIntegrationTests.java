package com.turfoff.turfbooking.repositories;

import com.turfoff.turfbooking.TestDataUtil;
import com.turfoff.turfbooking.domain.mysql.entities.AdminEntity;
import com.turfoff.turfbooking.domain.mongo.entities.TurfEntity;
import com.turfoff.turfbooking.repositories.mongo.TurfRepository;
import com.turfoff.turfbooking.repositories.mysql.AdminRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@SpringBootTest
@ExtendWith(SpringExtension.class)
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class TurfEntityRepositoryIntegrationTests {

    private TurfRepository underTest;
    private AdminRepository adminRepository;

    @Autowired
    public TurfEntityRepositoryIntegrationTests(TurfRepository underTest, AdminRepository adminRepository) {
        this.underTest = underTest;
        this.adminRepository = adminRepository;
    }

    @Test
    public void testThatTurfCanBeCreatedAndRecalled() {

        AdminEntity adminEntity = TestDataUtil.createTestAdminA();
        AdminEntity savedAdminEntity = adminRepository.save(adminEntity);

        TurfEntity turfEntity = TestDataUtil.createTestTurfEntity(savedAdminEntity.getId());
        TurfEntity savedEntity = underTest.save(turfEntity);
        Optional<TurfEntity> receivedTurf = underTest.findById(savedEntity.getId());
        Assertions.assertThat(receivedTurf).isPresent();
        Assertions.assertThat(receivedTurf.get()).isEqualTo(turfEntity);
    }
}
