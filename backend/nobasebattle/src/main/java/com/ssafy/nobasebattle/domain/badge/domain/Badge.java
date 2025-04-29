package com.ssafy.nobasebattle.domain.badge.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "badges")
@Getter
@NoArgsConstructor
public class Badge extends BaseEntity {

    private String text;
    private String imageUrl;
    private String badgeType;
    private Integer condition;

    @Builder
    public Badge(String text, String imageUrl, String badgeType, Integer condition) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.badgeType = badgeType;
        this.condition = condition;
    }
}
