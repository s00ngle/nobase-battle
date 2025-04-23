package com.ssafy.nobasebattle.domain.textcharacter.domain.repository;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TextCharacterRepository extends MongoRepository<TextCharacter, String> {
    @Query("{ 'createdAt' : { $gte: ?0, $lt: ?1 } }")
    List<TextCharacter> findByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    long countByUserId(String userId);

    List<TextCharacter> findByUserId(String userId);

}
