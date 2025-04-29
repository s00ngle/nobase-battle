package com.ssafy.nobasebattle.domain.battle.domain.repository;

import com.ssafy.nobasebattle.domain.battle.domain.Battle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BattleRepository extends MongoRepository<Battle, String>  {
}
