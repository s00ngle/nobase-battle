package com.ssafy.nobasebattle.domain.textcharacter.domain.repository;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TextCharacterRepository extends MongoRepository<TextCharacter, String> {

}
