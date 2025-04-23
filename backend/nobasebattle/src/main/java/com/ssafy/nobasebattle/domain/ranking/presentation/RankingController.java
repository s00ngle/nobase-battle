package com.ssafy.nobasebattle.domain.ranking.presentation;

import com.ssafy.nobasebattle.domain.ranking.presentation.response.RankingCharacterResponse;
import com.ssafy.nobasebattle.domain.ranking.service.RankingService;
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
    public List<RankingCharacterResponse> getTextRankers() {
        return rankingService.getTextTopCharacters(count);
    }

    @GetMapping("/text/daily")
    public List<RankingCharacterResponse> getTodayTextRankers() {
        return rankingService.getTodayTextTopRankers(count);
    }

    @GetMapping("/image/inf")
    public List<RankingCharacterResponse> getImageRankers() {
        return rankingService.getImageTopCharacters(count);
    }

    @GetMapping("/image/daily")
    public List<RankingCharacterResponse> getTodayImageRankers() {
        return rankingService.getTodayImageTopRankers(count);
    }
}
