package com.ssafy.nobasebattle.domain.textcharacter.domain.repository;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface TextCharacterRepository extends MongoRepository<TextCharacter, String> {
    @Query("{ 'createdAt' : { $gte: ?0, $lt: ?1 } }")
    List<TextCharacter> findByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
