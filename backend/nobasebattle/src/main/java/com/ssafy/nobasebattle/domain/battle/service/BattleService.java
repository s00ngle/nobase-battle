package com.ssafy.nobasebattle.domain.battle.service;

import com.ssafy.nobasebattle.domain.battle.domain.Battle;
import com.ssafy.nobasebattle.domain.battle.domain.repository.BattleRepository;
import com.ssafy.nobasebattle.domain.battle.exception.BattleAgainstSelfException;
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

    /**
     * 이미지 캐릭터 배틀 수행
     */
//    @Transactional
    public BattleResponse performImageBattle(BattleRequest battleRequest) {
        // 현재 사용자 ID 조회
        String currentUserId = SecurityUtils.getCurrentUserId();

        // 요청된 캐릭터 ID 유효성 검증 및 조회
        ImageCharacter myCharacter = findAndValidateImageCharacter(battleRequest.getCharacterId(), currentUserId);

        // 배틀 모드에 따라 상대 캐릭터 선택
        ImageCharacter opponentCharacter = selectImageOpponent(battleRequest, myCharacter, currentUserId);

        Battle battle = calculateImageBattleResult(myCharacter, opponentCharacter);

        // 새 ELO 점수 계산 및 캐릭터 정보 업데이트
        updateCharactersStats(myCharacter, opponentCharacter, battle.getResult());

        return new BattleResponse(battle, myCharacter, opponentCharacter);
    }

    /**
     * 캐릭터 ID로 캐릭터 조회 및 유효성 검증
     */
    private ImageCharacter findAndValidateImageCharacter(String characterId, String userId) {
        if (characterId == null || characterId.isEmpty()) {
            throw ImageCharacterNotFoundException.EXCEPTION;
        }

        ImageCharacter character = imageCharacterRepository.findById(characterId)
                .orElseThrow(() -> ImageCharacterNotFoundException.EXCEPTION);

        // 캐릭터 소유권 확인
        if (!character.getUserId().equals(userId)) {
            throw NotImageChracterHostException.EXCEPTION;
        }

        return character;
    }

    /**
     * 배틀 모드에 따라 상대 캐릭터 선택
     */
    private ImageCharacter selectImageOpponent(BattleRequest battleRequest, ImageCharacter myCharacter, String currentUserId) {
        String mode = battleRequest.getMode();

        // 배틀 모드 유효성 검사
        if (mode != null && !mode.equals("RANDOM") && !mode.equals("CHALLENGE")) {
            throw InvalidBattleModeException.EXCEPTION;
        }

        // CHALLENGE 모드: 특정 상대와 배틀
        if ("CHALLENGE".equals(mode)) {
            if (battleRequest.getOpponentId() == null || battleRequest.getOpponentId().isEmpty()) {
                throw OpponentRequiredException.EXCEPTION;
            }

            ImageCharacter opponent = imageCharacterRepository.findById(battleRequest.getOpponentId())
                    .orElseThrow(() -> ImageCharacterNotFoundException.EXCEPTION);

            // 자기 자신과의 배틀 방지
            if (opponent.getId().equals(myCharacter.getId())) {
                throw BattleAgainstSelfException.EXCEPTION;
            }

            return opponent;
        }
        // RANDOM 모드: 랜덤 상대와 배틀
        else {
            List<ImageCharacter> potentialOpponents = imageCharacterRepository.findByUserIdNot(currentUserId);

            if (potentialOpponents.isEmpty()) {
                // 다른 사용자의 캐릭터가 없는 경우, 다른 자신의 캐릭터 중에서 선택
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

    /**
     * 배틀 결과 계산
     * 현재는 간단한 랜덤 로직 사용, 실제 구현에서는 AI 판정이나 다양한 요소 고려
     */
    private Battle calculateImageBattleResult(ImageCharacter myCharacter, ImageCharacter opponentCharacter) {
        // 승패를 결정하는 요소들 (캐릭터 ELO 점수 기반)
        int myElo = myCharacter.getEloScore() != null ? myCharacter.getEloScore() : 1000;
        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;
        int battleResult;

        // ELO 점수에 기반한 승률 계산 (기대 승률)
        double expectedWinRate = 1.0 / (1.0 + Math.pow(10.0, (opponentElo - myElo) / 400.0));

        // 무작위 값 생성
        double randomValue = random.nextDouble();

        // 기대 승률보다 낮은 랜덤 값이 나오면 승리
        if (randomValue < expectedWinRate * 0.8) {
            battleResult = 1;  // 승리
        } else if (randomValue < expectedWinRate * 1.2) {
            battleResult = 0;  // 무승부
        } else {
            battleResult = -1; // 패배
        }

        String battleLog = "Batte Log";

        return createAndSaveImageBattle(myCharacter, opponentCharacter, battleResult, battleLog);
    }

    /**
     * 캐릭터 통계 (ELO, 승/패/무) 업데이트
     */
    private void updateCharactersStats(ImageCharacter myCharacter, ImageCharacter opponentCharacter, int result) {
        // 현재 ELO 점수 가져오기
        int myElo = myCharacter.getEloScore() != null ? myCharacter.getEloScore() : 1000;
        int opponentElo = opponentCharacter.getEloScore() != null ? opponentCharacter.getEloScore() : 1000;

        // 새 ELO 점수 계산
        int[] newRatings = eloRatingService.calculateNewRatings(myElo, opponentElo, result);

        // 승/패/무 기록 업데이트
        updateWinLossDraws(myCharacter, result == 1, result == -1, result == 0);
//        updateWinLossDraws(opponentCharacter, result == -1, result == 1, result == 0);

        // ELO 점수 업데이트
        myCharacter.updateEloScore(newRatings[0]);
//        opponentCharacter.updateEloScore(newRatings[1]);

        // 변경된 정보 저장
        imageCharacterRepository.save(myCharacter);
        imageCharacterRepository.save(opponentCharacter);
    }

    /**
     * 승/패/무 통계 업데이트
     */
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

    /**
     * 배틀 정보를 생성하고 저장
     */
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
