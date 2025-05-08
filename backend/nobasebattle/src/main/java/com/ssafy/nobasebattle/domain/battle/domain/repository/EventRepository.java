package com.ssafy.nobasebattle.domain.battle.domain.repository;

import com.ssafy.nobasebattle.domain.battle.domain.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EventRepository extends MongoRepository<Event, String> {

    Optional<Event> findTopByOrderByCreatedAtDesc();
}
