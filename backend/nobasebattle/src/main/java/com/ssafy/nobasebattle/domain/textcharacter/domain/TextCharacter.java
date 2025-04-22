package com.ssafy.nobasebattle.domain.textcharacter.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "text_characters")
@NoArgsConstructor
@Data
public class TextCharacter extends BaseEntity {

    private String name;
    private String prompt;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
//    private String colorRank;
}
