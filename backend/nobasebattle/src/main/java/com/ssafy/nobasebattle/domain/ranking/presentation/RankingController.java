package com.ssafy.nobasebattle.domain.ranking.presentation;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
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

    private static final int count = 10;

    @GetMapping("/text/inf")
    public List<TextCharacter> getTextRankers() {
        return rankingService.getTextTopCharacters(count);
    }

    @GetMapping("/text/daily")
    public List<TextCharacter> getTodayTextRankers() {
        return rankingService.getTodayTextTopRankers(count);
    }

    @GetMapping("/image/inf")
    public List<ImageCharacter> getImageRankers() {
        return rankingService.getImageTopCharacters(count);
    }

    @GetMapping("/image/daily")
    public List<ImageCharacter> getTodayImageRankers() {
        return rankingService.getTodayImageTopRankers(count);
    }
}
