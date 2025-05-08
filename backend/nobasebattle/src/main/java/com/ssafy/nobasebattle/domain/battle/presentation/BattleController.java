package com.ssafy.nobasebattle.domain.battle.presentation;

import com.ssafy.nobasebattle.domain.battle.presentation.dto.request.BattleRequest;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.response.BattleResponse;
import com.ssafy.nobasebattle.domain.battle.service.BattleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/battles")
@RestController
public class BattleController {

    private final BattleService battleService;

    @PostMapping("/image")
    public BattleResponse performImageBattle(@RequestBody BattleRequest battleRequest) {
        battleRequest.validate();
        return battleService.performImageBattle(battleRequest);
    }

    @PostMapping("/text")
    public BattleResponse performTextBattle(@RequestBody BattleRequest battleRequest) {
        battleRequest.validate();
        return battleService.performTextBattle(battleRequest);
    }

    @PostMapping("/event")
    public BattleResponse performEventBattle(@RequestBody BattleRequest battleRequest) {
        battleRequest.validate();
        return battleService.performEventBattle(battleRequest);
    }
}
