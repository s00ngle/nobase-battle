package com.ssafy.nobasebattle.domain.battle.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "battles")
@Getter
@NoArgsConstructor
public class Battle extends BaseEntity {

    private String firstCharacterId;
    private String secondCharacterId;
    private Integer result;
    private String battleType;
    private String battleLog;

    @Builder
    public Battle(String firstCharacterId, String secondCharacterId, Integer result, String battleType, String battleLog) {
        this.firstCharacterId = firstCharacterId;
        this.secondCharacterId = secondCharacterId;
        this.result = result;
        this.battleType = battleType;
        this.battleLog = battleLog;
    }
}
