package com.ssafy.nobasebattle.domain.battle.service;

import com.ssafy.nobasebattle.domain.badge.service.BadgeService;
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
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import com.ssafy.nobasebattle.domain.textcharacter.service.TextCharacterServiceUtils;
import com.ssafy.nobasebattle.global.utils.ranking.RankSearchUtils;
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
    private final TextCharacterServiceUtils textCharacterServiceUtils;
    private final TextCharacterRepository textCharacterRepository;
    private final OpenAIService openAIService;
    private final EloRatingService eloRatingService;
    private final BadgeService badgeService;
    private final Random random = new Random();
    private final RankSearchUtils rankSearchUtils;

//    @Transactional
    public BattleResponse performImageBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        ImageCharacter myCharacter = findAndValidateImageCharacter(battleRequest.getCharacterId(), currentUserId);

        ImageCharacter opponentCharacter = selectImageOpponent(battleRequest, myCharacter, currentUserId);

        myCharacter.updateLastBattleTime();

        Battle battle = calculateImageBattleResult(myCharacter, opponentCharacter);

        if(("RANDOM").equals(battleRequest.getMode())) {
            updateCharactersStats(myCharacter, opponentCharacter, battle.getResult());
            rankSearchUtils.addImageCharacterToRank(myCharacter);
        }

        return new BattleResponse(battle, myCharacter, opponentCharacter);
    }

    public BattleResponse performTextBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        TextCharacter myCharacter = findAndValidateTextCharacter(battleRequest.getCharacterId(), currentUserId);

        TextCharacter opponentCharacter = selectTextOpponent(battleRequest, myCharacter, currentUserId);

        myCharacter.updateLastBattleTime();

        Battle battle = calculateTextBattleResult(myCharacter, opponentCharacter);

        if(("RANDOM").equals(battleRequest.getMode())) {
            updateTextCharactersStats(myCharacter, opponentCharacter, battle.getResult());
            rankSearchUtils.addTextCharacterToRank(myCharacter);
        }

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

        character.validUserIsHost(userId);

        return character;
    }

    private TextCharacter findAndValidateTextCharacter(String characterId, String userId) {
        if (characterId == null || characterId.isEmpty()) {
            throw ImageCharacterNotFoundException.EXCEPTION;
        }

        TextCharacter character = textCharacterServiceUtils.queryTextCharacter(characterId);

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

    private TextCharacter selectTextOpponent(BattleRequest battleRequest, TextCharacter myCharacter, String currentUserId) {
        String mode = battleRequest.getMode();

        if (mode != null && !mode.equals("RANDOM") && !mode.equals("CHALLENGE")) {
            throw InvalidBattleModeException.EXCEPTION;
        }

        if ("CHALLENGE".equals(mode)) {
            if (battleRequest.getOpponentId() == null || battleRequest.getOpponentId().isEmpty()) {
                throw OpponentRequiredException.EXCEPTION;
            }

            TextCharacter opponent = textCharacterServiceUtils.queryTextCharacter(battleRequest.getOpponentId());

            if (opponent.getId().equals(myCharacter.getId())) {
                throw BattleAgainstSelfException.EXCEPTION;
            }

            return opponent;
        }
        else {
            List<TextCharacter> potentialOpponents = textCharacterRepository.findByUserIdNot(currentUserId);

            if (potentialOpponents.isEmpty()) {
                List<TextCharacter> myOtherCharacters = textCharacterRepository.findByUserIdAndIdNot(
                        currentUserId, myCharacter.getId());

                if (myOtherCharacters.isEmpty()) {
                    throw ImageCharacterNotFoundException.EXCEPTION;
                }

                return myOtherCharacters.get(random.nextInt(myOtherCharacters.size()));
            }

            return potentialOpponents.get(random.nextInt(potentialOpponents.size()));
        }
    }

    private Battle calculateTextBattleResult(TextCharacter myCharacter, TextCharacter opponentCharacter) {

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

        OpenAIService.BattleResult battleResult = openAIService.analyzeTextAndDetermineBattle(
                myCharacter.getName(),
                myCharacter.getPrompt(),
                opponentCharacter.getName(),
                opponentCharacter.getPrompt()
        );

        log.info("OpenAI API 배틀 결과: {}, 배틀 로그 길이: {}",
                battleResult.getResult(),
                battleResult.getBattleLog().length());

        return createAndSaveTextBattle(
                myCharacter,
                opponentCharacter,
                battleResult.getResult(),
                battleResult.getBattleLog()
        );

//        return createAndSaveImageBattle(myCharacter, opponentCharacter, battleResult, battleLog);
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


    private Battle calculateTextBattleResult(ImageCharacter myCharacter, ImageCharacter opponentCharacter) {

        log.info("OpenAI API를 통해 x 배틀 결과 판정 시작");

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

    private void updateTextCharactersStats(TextCharacter myCharacter, TextCharacter opponentCharacter, int result) {

        int myElo = myCharacter.getEloScore() != null ? myCharacter.getEloScore() : 1000;
        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;

        int[] newRatings = eloRatingService.calculateNewRatings(myElo, opponentElo, result);

        updateTextWinLossDraws(myCharacter, result == 1, result == -1, result == 0);
//        updateWinLossDraws(opponentCharacter, result == -1, result == 1, result == 0);

        myCharacter.updateEloScore(newRatings[0]);
//        opponentCharacter.updateEloScore(newRatings[1]);

        textCharacterRepository.save(myCharacter);
//        imageCharacterRepository.save(opponentCharacter);
    }

    private void updateTextWinLossDraws(TextCharacter character, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = character.getWins() != null ? character.getWins() : 0;
        int losses = character.getLosses() != null ? character.getLosses() : 0;
        int draws = character.getDraws() != null ? character.getDraws() : 0;

        if (isWin) {
            character.updateWins(wins + 1);

            badgeService.checkAndAwardWinBadgesText(character, character.getWins());
        } else if (isLoss) {
            character.updateLosses(losses + 1);
        } else if (isDraw) {
            character.updateDraws(draws + 1);
        }
    }

    private void updateWinLossDraws(ImageCharacter character, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = character.getWins() != null ? character.getWins() : 0;
        int losses = character.getLosses() != null ? character.getLosses() : 0;
        int draws = character.getDraws() != null ? character.getDraws() : 0;

        if (isWin) {
            character.updateWins(wins + 1);

            badgeService.checkAndAwardWinBadges(character, character.getWins());
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

    private Battle createAndSaveTextBattle(TextCharacter myCharacter, TextCharacter opponentCharacter, int result, String battleLog) {

        Battle battle = Battle.builder()
                .firstCharacterId(myCharacter.getId())
                .secondCharacterId(opponentCharacter.getId())
                .result(result)
                .battleType("TEXT")
                .battleLog(battleLog)
                .build();

        return battleRepository.save(battle);
    }
}
