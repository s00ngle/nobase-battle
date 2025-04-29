package com.ssafy.nobasebattle.domain.badge.service;

import com.ssafy.nobasebattle.domain.badge.domain.Badge;
import com.ssafy.nobasebattle.domain.badge.domain.repository.BadgeRepository;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.BadgeInfo;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.request.BadgeRequest;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.response.BadgeResponse;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
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

    // 승리 기반 뱃지 확인 및 부여
    public void checkAndAwardWinBadges(ImageCharacter imageCharacter, int wins) {

        List<Badge> winBasedBadges = badgeRepository.findByBadgeTypeOrderByConditionAsc("WIN_BASED");

        if (winBasedBadges.isEmpty()) {
            return; // 승수 기반 뱃지가 없으면 종료
        }

        boolean updated = false;

        // 모든 승수 기반 뱃지를 확인
        for (Badge badge : winBasedBadges) {
            // 필요한 승수를 달성했고, 아직 해당 뱃지가 없는 경우
            if (badge.getCondition() <= wins && !imageCharacter.hasBadge(badge.getText())) {
                imageCharacter.addBadge(badge);
                updated = true;
            }
        }

        if (updated) {
            imageCharacterRepository.save(imageCharacter);
        }
    }

    public List<BadgeInfo> getBadgeInfos(List<BadgeResponse> badges) {
        // 뱃지 응답이 없으면 빈 리스트 반환
        if (badges == null || badges.isEmpty()) {
            return Collections.emptyList();
        }

        // 모든 뱃지 텍스트 추출
        List<String> badgeTexts = badges.stream()
                .map(BadgeResponse::getText)
                .collect(Collectors.toList());

        // 텍스트를 키로, Badge를 값으로 하는 맵 생성
        // findAllByTextIn 메소드는 Repository에 추가해야 함
        List<Badge> allBadges = badgeRepository.findAllByTextIn(badgeTexts);
        Map<String, Badge> badgeMap = allBadges.stream()
                .collect(Collectors.toMap(Badge::getText, badge -> badge));

        // 결과 리스트 생성
        List<BadgeInfo> badgeInfos = new ArrayList<>();
        for (BadgeResponse badgeResponse : badges) {
            Badge badge = badgeMap.get(badgeResponse.getText());
            if (badge != null) {
                badgeInfos.add(new BadgeInfo(badge));
            } else {
                // 로깅 또는 예외 처리
                log.warn("해당 텍스트의 뱃지를 찾을 수 없습니다: {}", badgeResponse.getText());
            }
        }

        return badgeInfos;
    }
}
