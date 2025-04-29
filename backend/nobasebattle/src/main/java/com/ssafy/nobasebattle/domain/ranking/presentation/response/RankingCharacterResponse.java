package com.ssafy.nobasebattle.domain.ranking.presentation.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.nobasebattle.domain.badge.presentation.dto.BadgeInfo;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RankingCharacterResponse {

    private Integer rank;
    private String characterId;
    private String name;

    private String prompt;
    private String imageUrl;

    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<BadgeInfo> badges;
}
