package com.ssafy.nobasebattle.domain.badge.presentation;

import com.ssafy.nobasebattle.domain.badge.presentation.dto.BadgeInfo;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.request.BadgeRequest;
import com.ssafy.nobasebattle.domain.badge.service.BadgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/badges")
@RestController
public class BadgeController {

    private final BadgeService badgeService;

    @PostMapping
    public BadgeInfo createBadge(@RequestBody BadgeRequest badgeRequest) {
        return badgeService.createBadge(badgeRequest);
    }

}
