package com.ssafy.nobasebattle.domain.badge.domain.repository;

import com.ssafy.nobasebattle.domain.badge.domain.Badge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BadgeRepository extends MongoRepository<Badge, String> {

    Optional<Badge> findByText(String text);

    List<Badge> findByBadgeTypeOrderByConditionAsc(String badgeType);

    List<Badge> findAllByTextIn(List<String> texts);
}
