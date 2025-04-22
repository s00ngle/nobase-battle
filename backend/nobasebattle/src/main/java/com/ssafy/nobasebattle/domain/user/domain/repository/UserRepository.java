package com.ssafy.nobasebattle.domain.user.domain.repository;

import com.ssafy.nobasebattle.domain.user.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
    Optional<User> findByEmailAndPassword(String email, String password);
}
