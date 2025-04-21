package com.ssafy.nobasebattle.domain.user.domain.repository;

import com.ssafy.nobasebattle.domain.user.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

}
