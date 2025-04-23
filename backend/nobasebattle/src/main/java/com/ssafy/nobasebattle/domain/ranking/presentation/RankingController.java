package com.ssafy.nobasebattle.domain.ranking.presentation;

import com.ssafy.nobasebattle.domain.ranking.presentation.response.RankingCharacterResponse;
import com.ssafy.nobasebattle.domain.ranking.service.RankingService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/text/inf/{id}")
    public Long getTextRank(@PathVariable String id) {
        return rankingService.getTextCharacterRank(id);
    }

    @GetMapping("/image/inf/{id}")
    public Long getImageRank(@PathVariable String id) {
        return rankingService.getImageCharacterRank(id);
    }

    @GetMapping("/text/daily/{id}")
    public Long getTextTodayRank(@PathVariable String id) {
        return rankingService.getTodayTextCharacterRank(id);
    }

    @GetMapping("/image/daily/{id}")
    public Long getImageTodayRank(@PathVariable String id) {
        return rankingService.getTodayImageCharacterRank(id);
    }
}
