package com.ssafy.nobasebattle.domain.textcharacter.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "text_characters")
@NoArgsConstructor
@Getter
public class TextCharacter extends BaseEntity {

    private String name;
    private String prompt;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
//    private String colorRank;
}
