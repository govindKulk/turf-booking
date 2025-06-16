package com.turfoff.turfbooking.repositories;

import com.turfoff.turfbooking.TestDataUtil;
import com.turfoff.turfbooking.domain.mysql.entities.UserEntity;
import com.turfoff.turfbooking.repositories.mysql.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class UserEntityRepositoryIntegrationTests {

    @Autowired
    private UserRepository underTest;


    @Test
    public void testThatUserCanBeCreatedAndRecalled() {
        UserEntity userEntity = TestDataUtil.createTestUserEntity();
        UserEntity user = underTest.save(userEntity);
        Optional<UserEntity> returnedUser = underTest.findById(user.getId());
        Assertions.assertThat(returnedUser).isPresent();
        Assertions.assertThat(returnedUser.get()).isEqualTo(userEntity);
    }

}

