package com.ssafy.nobasebattle.domain.imagecharacter.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "image_characters")
@NoArgsConstructor
public class ImageCharacter extends BaseEntity {

    private String name;
    private String imageUrl;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
//    private String colorRank;
}
