package com.ssafy.nobasebattle.domain.ranking.presentation.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RankingCharacterResponse {
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
}
