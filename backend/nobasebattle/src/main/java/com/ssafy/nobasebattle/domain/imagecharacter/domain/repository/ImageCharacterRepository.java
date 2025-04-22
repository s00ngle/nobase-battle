package com.ssafy.nobasebattle.domain.imagecharacter.domain.repository;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ImageCharacterRepository extends MongoRepository<ImageCharacter, String> {

}
