package com.ssafy.nobasebattle.domain.battle.service;

import com.ssafy.nobasebattle.domain.badge.service.BadgeService;
import com.ssafy.nobasebattle.domain.battle.domain.Battle;
import com.ssafy.nobasebattle.domain.battle.domain.repository.BattleRepository;
import com.ssafy.nobasebattle.domain.battle.exception.BattleAgainstSelfException;
import com.ssafy.nobasebattle.domain.battle.exception.BattleCooldownException;
import com.ssafy.nobasebattle.domain.battle.exception.InvalidBattleModeException;
import com.ssafy.nobasebattle.domain.battle.exception.OpponentRequiredException;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.EventInfo;
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
    private final EventService eventService;

//    @Transactional
    public BattleResponse performImageBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        ImageCharacter myCharacter = findAndValidateImageCharacter(battleRequest.getCharacterId(), currentUserId);

        ImageCharacter opponentCharacter = selectImageOpponent(battleRequest, myCharacter, currentUserId);

        Battle battle = calculateImageBattleResult(myCharacter, opponentCharacter);

        myCharacter.updateLastBattleTime();

        if(("RANDOM").equals(battleRequest.getMode())) {
            updateCharactersStats(myCharacter, opponentCharacter, battle.getResult());
            rankSearchUtils.addImageCharacterToRank(myCharacter);
        } else {
            updateImageCharacterBattleTime(myCharacter);
        }

        return new BattleResponse(battle, myCharacter, opponentCharacter);
    }

    public BattleResponse performTextBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        TextCharacter myCharacter = findAndValidateTextCharacter(battleRequest.getCharacterId(), currentUserId);

        TextCharacter opponentCharacter = selectTextOpponent(battleRequest, myCharacter, currentUserId);

        Battle battle = calculateTextBattleResult(myCharacter, opponentCharacter);

        myCharacter.updateLastBattleTime();

        if(("RANDOM").equals(battleRequest.getMode())) {
            updateTextCharactersStats(myCharacter, opponentCharacter, battle.getResult());
            rankSearchUtils.addTextCharacterToRank(myCharacter);
        } else {
            updateTextCharacterBattleTime(myCharacter);
        }

        return new BattleResponse(battle, myCharacter, opponentCharacter);
    }

    public BattleResponse performEventBattle(BattleRequest battleRequest) {
        String currentUserId = SecurityUtils.getCurrentUserId();

        ImageCharacter myCharacter = findAndValidateImageCharacter(battleRequest.getCharacterId(), currentUserId);

        ImageCharacter opponentCharacter = selectEventOpponent(battleRequest, myCharacter, currentUserId);

        Battle battle = calculateEventBattleResult(myCharacter, opponentCharacter);

        myCharacter.updateLastBattleTime();

        updateEventCharactersStats(myCharacter, opponentCharacter, battle.getResult());
//        rankSearchUtils.addImageCharacterToRank(myCharacter);

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

        character.updateLastBattleTime();
        imageCharacterRepository.save(character);

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

        character.updateLastBattleTime();
        textCharacterRepository.save(character);

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
//            List<ImageCharacter> potentialOpponents = imageCharacterRepository.findByUserIdNot(currentUserId);
//
//            if (potentialOpponents.isEmpty()) {
//                List<ImageCharacter> myOtherCharacters = imageCharacterRepository.findByUserIdAndIdNot(
//                        currentUserId, myCharacter.getId());
//
//                if (myOtherCharacters.isEmpty()) {
//                    throw ImageCharacterNotFoundException.EXCEPTION;
//                }
//
//                return myOtherCharacters.get(random.nextInt(myOtherCharacters.size()));
//            }
//
//            return potentialOpponents.get(random.nextInt(potentialOpponents.size()));
            String myId = myCharacter.getId();

            return rankSearchUtils.matchImageCharacter(myId).orElseThrow(() -> OpponentRequiredException.EXCEPTION);
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
//            List<TextCharacter> potentialOpponents = textCharacterRepository.findByUserIdNot(currentUserId);
//
//            if (potentialOpponents.isEmpty()) {
//                List<TextCharacter> myOtherCharacters = textCharacterRepository.findByUserIdAndIdNot(
//                        currentUserId, myCharacter.getId());
//
//                if (myOtherCharacters.isEmpty()) {
//                    throw ImageCharacterNotFoundException.EXCEPTION;
//                }
//
//                return myOtherCharacters.get(random.nextInt(myOtherCharacters.size()));
//            }
//
//            return potentialOpponents.get(random.nextInt(potentialOpponents.size()));
            String myId = myCharacter.getId();

            return rankSearchUtils.matchTextCharacter(myId).orElseThrow(() -> OpponentRequiredException.EXCEPTION);
        }
    }

    private ImageCharacter selectEventOpponent(BattleRequest battleRequest, ImageCharacter myCharacter, String currentUserId) {
        String mode = battleRequest.getMode();

        if (mode != null && !mode.equals("EVENT")) {
            throw InvalidBattleModeException.EXCEPTION;
        }

//        List<ImageCharacter> potentialOpponents = imageCharacterRepository.findByUserIdNot(currentUserId);
//
//        if (potentialOpponents.isEmpty()) {
//            List<ImageCharacter> myOtherCharacters = imageCharacterRepository.findByUserIdAndIdNot(
//                    currentUserId, myCharacter.getId());
//
//            if (myOtherCharacters.isEmpty()) {
//                throw ImageCharacterNotFoundException.EXCEPTION;
//            }
//
//            return myOtherCharacters.get(random.nextInt(myOtherCharacters.size()));
//        }
//
//        return potentialOpponents.get(random.nextInt(potentialOpponents.size()));
        String myId = myCharacter.getId();

        return rankSearchUtils.matchEventCharacter(myId).orElseThrow(() -> OpponentRequiredException.EXCEPTION);

    }

    private Battle calculateTextBattleResult(TextCharacter myCharacter, TextCharacter opponentCharacter) {

        OpenAIService.BattleResult battleResult = openAIService.analyzeTextAndDetermineBattle(
                myCharacter.getName(),
                myCharacter.getPrompt(),
                opponentCharacter.getName(),
                opponentCharacter.getPrompt()
        );

        return createAndSaveTextBattle(
                myCharacter,
                opponentCharacter,
                battleResult.getResult(),
                battleResult.getBattleLog()
        );
    }

    private Battle calculateImageBattleResult(ImageCharacter myCharacter, ImageCharacter opponentCharacter) {

        OpenAIService.BattleResult battleResult = openAIService.analyzeImagesAndDetermineBattle(
                myCharacter.getName(),
                myCharacter.getImageUrl(),
                opponentCharacter.getName(),
                opponentCharacter.getImageUrl()
        );

        return createAndSaveImageBattle(
                myCharacter,
                opponentCharacter,
                battleResult.getResult(),
                battleResult.getBattleLog()
        );
    }

    private Battle calculateEventBattleResult(ImageCharacter myCharacter, ImageCharacter opponentCharacter) {

        OpenAIService.BattleResult battleResult = openAIService.analyzeImagesAndDetermineBattle(
                myCharacter.getName(),
                myCharacter.getImageUrl(),
                opponentCharacter.getName(),
                opponentCharacter.getImageUrl()
        );

        return createAndSaveEventBattle(
                myCharacter,
                opponentCharacter,
                battleResult.getResult(),
                battleResult.getBattleLog()
        );
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

    private void updateEventCharactersStats(ImageCharacter myCharacter, ImageCharacter opponentCharacter, int result) {
        EventInfo eventInfo = myCharacter.getEventInfo() != null ? myCharacter.getEventInfo() : new EventInfo(eventService.getLatestEventEntity());
        int myElo = eventInfo.getEloScore() != null ? eventInfo.getEloScore() : 1000;
        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;

        int[] newRatings = eloRatingService.calculateNewRatings(myElo, opponentElo, result);

        updateEventWinLossDraws(eventInfo, result == 1, result == -1, result == 0);
//        updateWinLossDraws(opponentCharacter, result == -1, result == 1, result == 0);

        eventInfo.updateEventEloScore(newRatings[0]);
//        opponentCharacter.updateEloScore(newRatings[1]);

        myCharacter.updateEventInfo(eventInfo);

        imageCharacterRepository.save(myCharacter);
//        imageCharacterRepository.save(opponentCharacter);
    }

    private void updateImageCharacterBattleTime(ImageCharacter character){ imageCharacterRepository.save(character); }

    private void updateTextCharacterBattleTime(TextCharacter character){
        textCharacterRepository.save(character);
    }

    private void updateTextWinLossDraws(TextCharacter character, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = character.getWins() != null ? character.getWins() : 0;
        int losses = character.getLosses() != null ? character.getLosses() : 0;
        int draws = character.getDraws() != null ? character.getDraws() : 0;
        int winStreak = character.getWinStreak() != null ? character.getWinStreak() : 0;
        int loseStreak = character.getLoseStreak() != null ? character.getLoseStreak() : 0;

        if (isWin) {
            character.updateWins(wins + 1);

            character.updateWinStreak(winStreak + 1);
            character.resetLoseStreak();

            badgeService.checkAndAwardWinBadgesText(character, character.getWins());
        } else if (isLoss) {
            character.updateLosses(losses + 1);

            character.updateLoseStreak(loseStreak + 1);
            character.resetWinStreak();
        } else if (isDraw) {
            character.updateDraws(draws + 1);
        }
    }

    private void updateWinLossDraws(ImageCharacter character, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = character.getWins() != null ? character.getWins() : 0;
        int losses = character.getLosses() != null ? character.getLosses() : 0;
        int draws = character.getDraws() != null ? character.getDraws() : 0;
        int winStreak = character.getWinStreak() != null ? character.getWinStreak() : 0;
        int loseStreak = character.getLoseStreak() != null ? character.getLoseStreak() : 0;

        if (isWin) {
            character.updateWins(wins + 1);

            character.updateWinStreak(winStreak + 1);
            character.resetLoseStreak();

            badgeService.checkAndAwardWinBadges(character, character.getWins());
        } else if (isLoss) {
            character.updateLosses(losses + 1);

            character.updateLoseStreak(loseStreak + 1);
            character.resetWinStreak();
        } else if (isDraw) {
            character.updateDraws(draws + 1);
        }
    }
    private void updateEventWinLossDraws(EventInfo eventInfo, boolean isWin, boolean isLoss, boolean isDraw) {

        int wins = eventInfo.getWins() != null ? eventInfo.getWins() : 0;
        int losses = eventInfo.getLosses() != null ? eventInfo.getLosses() : 0;
        int draws = eventInfo.getDraws() != null ? eventInfo.getDraws() : 0;
        int winStreak = eventInfo.getWinStreak() != null ? eventInfo.getWinStreak() : 0;
        int loseStreak = eventInfo.getLoseStreak() != null ? eventInfo.getLoseStreak() : 0;

        if (isWin) {
            eventInfo.updateWins(wins + 1);

            eventInfo.updateWinStreak(winStreak + 1);
            eventInfo.resetLoseStreak();

        } else if (isLoss) {
            eventInfo.updateLosses(losses + 1);

            eventInfo.updateLoseStreak(loseStreak + 1);
            eventInfo.resetWinStreak();
        } else if (isDraw) {
            eventInfo.updateDraws(draws + 1);
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

    private Battle createAndSaveEventBattle(ImageCharacter myCharacter, ImageCharacter opponentCharacter, int result, String battleLog) {

        Battle battle = Battle.builder()
                .firstCharacterId(myCharacter.getId())
                .secondCharacterId(opponentCharacter.getId())
                .result(result)
                .battleType("EVENT")
                .battleLog(battleLog)
                .build();

        return battleRepository.save(battle);
    }
}
