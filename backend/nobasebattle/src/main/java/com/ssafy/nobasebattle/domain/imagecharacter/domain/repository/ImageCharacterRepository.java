package com.ssafy.nobasebattle.domain.imagecharacter.domain.repository;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;


public interface ImageCharacterRepository extends MongoRepository<ImageCharacter, String> {

    @Query("{ 'createdAt' : { $gte: ?0, $lt: ?1 } }")
    List<ImageCharacter> findByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    long countByUserId(String userId);

    List<ImageCharacter> findByUserId(String userId);

    @Query("{ 'userId': { $ne: ?0 } }")
    List<ImageCharacter> findByUserIdNot(String userId);

    List<ImageCharacter> findByUserIdAndIdNot(String userId, String id);
}
