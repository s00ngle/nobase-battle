package com.ssafy.nobasebattle.domain.battle.service;

import com.ssafy.nobasebattle.domain.battle.domain.Battle;
import com.ssafy.nobasebattle.domain.battle.domain.repository.BattleRepository;
import com.ssafy.nobasebattle.domain.battle.exception.BattleAgainstSelfException;
import com.ssafy.nobasebattle.domain.battle.exception.BattleCooldownException;
import com.ssafy.nobasebattle.domain.battle.exception.InvalidBattleModeException;
import com.ssafy.nobasebattle.domain.battle.exception.OpponentRequiredException;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.request.BattleRequest;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.response.BattleResponse;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.ImageCharacterNotFoundException;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.NotImageChracterHostException;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import com.ssafy.nobasebattle.global.utils.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Slf4j
@RequiredArgsConstructor
@Service
public class BattleService {

    private final BattleRepository battleRepository;
    private final ImageCharacterRepository imageCharacterRepository;
    private final TextCharacterRepository textCharacterRepository;
    private final OpenAIService openAIService;
    private final EloRatingService eloRatingService;
    private final Random random = new Random();

//    @Transactional
    public BattleResponse performImageBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        ImageCharacter myCharacter = findAndValidateImageCharacter(battleRequest.getCharacterId(), currentUserId);

        ImageCharacter opponentCharacter = selectImageOpponent(battleRequest, myCharacter, currentUserId);

        myCharacter.updateLastBattleTime();

        Battle battle = calculateImageBattleResult(myCharacter, opponentCharacter);

        updateCharactersStats(myCharacter, opponentCharacter, battle.getResult());

        return new BattleResponse(battle, myCharacter, opponentCharacter);
    }

    private ImageCharacter findAndValidateImageCharacter(String characterId, String userId) {
        if (characterId == null || characterId.isEmpty()) {
            throw ImageCharacterNotFoundException.EXCEPTION;
        }

        ImageCharacter character = imageCharacterRepository.findById(characterId)
                .orElseThrow(() -> ImageCharacterNotFoundException.EXCEPTION);

        if (character.getLastBattleTime().plusSeconds(10).isAfter(LocalDateTime.now())) {
            throw BattleCooldownException.EXCEPTION;
        }

        if (!character.getUserId().equals(userId)) {
            throw NotImageChracterHostException.EXCEPTION;
        }

        return character;
    }

    private ImageCharacter selectImageOpponent(BattleRequest battleRequest, ImageCharacter myCharacter, String currentUserId) {
        String mode = battleRequest.getMode();

        if (mode != null && !mode.equals("RANDOM") && !mode.equals("CHALLENGE")) {
            throw InvalidBattleModeException.EXCEPTION;
        }

        if ("CHALLENGE".equals(mode)) {
            if (battleRequest.getOpponentId() == null || battleRequest.getOpponentId().isEmpty()) {
                throw OpponentRequiredException.EXCEPTION;
            }

            ImageCharacter opponent = imageCharacterRepository.findById(battleRequest.getOpponentId())
                    .orElseThrow(() -> ImageCharacterNotFoundException.EXCEPTION);

            if (opponent.getId().equals(myCharacter.getId())) {
                throw BattleAgainstSelfException.EXCEPTION;
            }

            return opponent;
        }
        else {
            List<ImageCharacter> potentialOpponents = imageCharacterRepository.findByUserIdNot(currentUserId);

            if (potentialOpponents.isEmpty()) {
                List<ImageCharacter> myOtherCharacters = imageCharacterRepository.findByUserIdAndIdNot(
                        currentUserId, myCharacter.getId());

                if (myOtherCharacters.isEmpty()) {
                    throw ImageCharacterNotFoundException.EXCEPTION;
                }

                return myOtherCharacters.get(random.nextInt(myOtherCharacters.size()));
            }

            return potentialOpponents.get(random.nextInt(potentialOpponents.size()));
        }
    }

    private Battle calculateImageBattleResult(ImageCharacter myCharacter, ImageCharacter opponentCharacter) {

//        int myElo = myCharacter.getEloScore() != null ? myCharacter.getEloScore() : 1000;
//        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;
//        int battleResult;
//
//        double expectedWinRate = 1.0 / (1.0 + Math.pow(10.0, (opponentElo - myElo) / 400.0));
//
//        double randomValue = random.nextDouble();
//
//        if (randomValue < expectedWinRate * 0.8) {
//            battleResult = 1;  // 승리
//        } else if (randomValue < expectedWinRate * 1.2) {
//            battleResult = 0;  // 무승부
//        } else {
//            battleResult = -1; // 패배
//        }
//
//        String battleLog = "Batte Log";

        log.info("OpenAI API를 통해 이미지 배틀 결과 판정 시작");

        OpenAIService.BattleResult battleResult = openAIService.analyzeImagesAndDetermineBattle(
                myCharacter.getName(),
                myCharacter.getImageUrl(),
                opponentCharacter.getName(),
                opponentCharacter.getImageUrl()
        );

        log.info("OpenAI API 배틀 결과: {}, 배틀 로그 길이: {}",
                battleResult.getResult(),
                battleResult.getBattleLog().length());

        return createAndSaveImageBattle(
                myCharacter,
                opponentCharacter,
                battleResult.getResult(),
                battleResult.getBattleLog()
        );

//        return createAndSaveImageBattle(myCharacter, opponentCharacter, battleResult, battleLog);
    }

    private void updateCharactersStats(ImageCharacter myCharacter, ImageCharacter opponentCharacter, int result) {

        int myElo = myCharacter.getEloScore() != null ? myCharacter.getEloScore() : 1000;
        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;

        int[] newRatings = eloRatingService.calculateNewRatings(myElo, opponentElo, result);

        updateWinLossDraws(myCharacter, result == 1, result == -1, result == 0);
//        updateWinLossDraws(opponentCharacter, result == -1, result == 1, result == 0);

        myCharacter.updateEloScore(newRatings[0]);
//        opponentCharacter.updateEloScore(newRatings[1]);

        imageCharacterRepository.save(myCharacter);
//        imageCharacterRepository.save(opponentCharacter);
    }

    private void updateWinLossDraws(ImageCharacter character, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = character.getWins() != null ? character.getWins() : 0;
        int losses = character.getLosses() != null ? character.getLosses() : 0;
        int draws = character.getDraws() != null ? character.getDraws() : 0;

        if (isWin) {
            character.updateWins(wins + 1);
        } else if (isLoss) {
            character.updateLosses(losses + 1);
        } else if (isDraw) {
            character.updateDraws(draws + 1);
        }
    }

    private Battle createAndSaveImageBattle(ImageCharacter myCharacter, ImageCharacter opponentCharacter, int result, String battleLog) {

        Battle battle = Battle.builder()
                .firstCharacterId(myCharacter.getId())
                .secondCharacterId(opponentCharacter.getId())
                .result(result)
                .battleType("IMAGE")
                .battleLog(battleLog)
                .build();

        return battleRepository.save(battle);
    }
}
