package com.ssafy.nobasebattle.domain.badge.service;

import com.ssafy.nobasebattle.domain.badge.domain.Badge;
import com.ssafy.nobasebattle.domain.badge.domain.repository.BadgeRepository;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.BadgeInfo;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.request.BadgeRequest;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.response.BadgeResponse;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final TextCharacterRepository textCharacterRepository;
    private final ImageCharacterRepository imageCharacterRepository;

    public BadgeInfo createBadge(BadgeRequest badgeRequest) {

        Badge badge = makeBadge(badgeRequest);
        badgeRepository.save(badge);
        return getBadgeInfo(badge);
    }

    private Badge makeBadge(BadgeRequest badgeRequest) {

        return Badge.builder()
                .text(badgeRequest.getText())
                .imageUrl(badgeRequest.getImageUrl())
                .badgeType(badgeRequest.getBadgeType())
                .condition(badgeRequest.getCondition())
                .build();
    }

    private BadgeInfo getBadgeInfo(Badge badge) {

        return new BadgeInfo(badge);
    }

    public void checkAndAwardWinBadges(ImageCharacter imageCharacter, int wins) {

        List<Badge> winBasedBadges = badgeRepository.findByBadgeTypeOrderByConditionAsc("WIN_BASED");

        if (winBasedBadges.isEmpty()) {
            return;
        }

        boolean updated = false;

        for (Badge badge : winBasedBadges) {

            if (badge.getCondition() <= wins && !imageCharacter.hasBadge(badge.getText())) {
                imageCharacter.addBadge(badge);
                updated = true;
            }
        }

        if (updated) {
            imageCharacterRepository.save(imageCharacter);
        }
    }

    public void checkAndAwardWinBadgesText(TextCharacter textCharacter, int wins) {

        List<Badge> winBasedBadges = badgeRepository.findByBadgeTypeOrderByConditionAsc("WIN_BASED");

        if (winBasedBadges.isEmpty()) {
            return;
        }

        boolean updated = false;

        for (Badge badge : winBasedBadges) {

            if (badge.getCondition() <= wins && !textCharacter.hasBadge(badge.getText())) {
                textCharacter.addBadge(badge);
                updated = true;
            }
        }

        if (updated) {
            textCharacterRepository.save(textCharacter);
        }
    }

    public List<BadgeInfo> getBadgeInfos(List<BadgeResponse> badges) {

        if (badges == null || badges.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> badgeTexts = badges.stream()
                .map(BadgeResponse::getText)
                .collect(Collectors.toList());

        List<Badge> allBadges = badgeRepository.findAllByTextIn(badgeTexts);
        Map<String, Badge> badgeMap = allBadges.stream()
                .collect(Collectors.toMap(Badge::getText, badge -> badge));

        List<BadgeInfo> badgeInfos = new ArrayList<>();
        for (BadgeResponse badgeResponse : badges) {
            Badge badge = badgeMap.get(badgeResponse.getText());
            if (badge != null) {
                badgeInfos.add(new BadgeInfo(badge));
            } else {
                log.warn("해당 텍스트의 뱃지를 찾을 수 없습니다: {}", badgeResponse.getText());
            }
        }

        return badgeInfos;
    }
}
