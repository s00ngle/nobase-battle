package com.ssafy.nobasebattle.domain.ranking.presentation;

import com.ssafy.nobasebattle.domain.ranking.service.RankingService;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rankings")
@RequiredArgsConstructor
public class RankingController {

    @Autowired
    private final RankingService rankingService;

    @GetMapping("/text/inf")
    public List<TextCharacter> getRankers() {
        int count = 10;
        return rankingService.getTopCharacters(count);
    }

}
