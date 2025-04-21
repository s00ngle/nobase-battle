package com.ssafy.nobasebattle.domain.battle.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "battles")
@NoArgsConstructor
public class Battle extends BaseEntity {

    private ObjectId firstCharacterId;
    private ObjectId secondCharacterId;
    private Integer result;
//    private String battleType;
    private String battleLog;
}
