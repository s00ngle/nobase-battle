package com.ssafy.nobasebattle.domain.imagecharacter.service;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import com.ssafy.nobasebattle.domain.imagecharacter.exception.ImageCharacterNotFoundException;
import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request.CreateImageCharacterRequest;
import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request.UpdateImageCharacterRequest;
import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.response.ImageCharacterResponse;
import com.ssafy.nobasebattle.domain.imagecharacter.s3.S3Service;
import com.ssafy.nobasebattle.domain.textcharacter.exception.CharacterLimitExceededException;
import com.ssafy.nobasebattle.global.utils.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class ImageCharacterService {

    private final S3Service s3Service;
    private final ImageCharacterRepository imageCharacterRepository;

    private static final String IMAGE_DIRECTORY = "character-images";

    public ImageCharacterResponse createImageCharacter(CreateImageCharacterRequest createImageCharacterRequest, MultipartFile imageFile) {

        String userId = SecurityUtils.getCurrentUserId();
        long characterCount = imageCharacterRepository.countByUserId(userId);

        if (characterCount >= 5) {
            throw CharacterLimitExceededException.EXCEPTION;
        }

        String imageUrl = s3Service.uploadFile(imageFile, IMAGE_DIRECTORY);

        ImageCharacter imageCharacter = makeImageCharacter(createImageCharacterRequest, userId, imageUrl);
        imageCharacterRepository.save(imageCharacter);
        return getImageCharacterResponse(imageCharacter);
    }

    public void deleteImageCharacter(String imageCharacterId){

        String userId = SecurityUtils.getCurrentUserId();
        ImageCharacter imageCharacter = queryImageCharacter(imageCharacterId);
        imageCharacter.validUserIsHost(userId);

        // S3에서 이미지 삭제
//        if (imageCharacter.getImageUrl() != null && !imageCharacter.getImageUrl().isEmpty()) {
//            s3Service.deleteFile(imageCharacter.getImageUrl());
//        }

        imageCharacterRepository.delete(imageCharacter);
    }

    public ImageCharacterResponse updateImageCharacter(String imageCharacterId, UpdateImageCharacterRequest updateImageCharacterRequest, MultipartFile imageFile) {

        String currentUserId = SecurityUtils.getCurrentUserId();
        ImageCharacter imageCharacter = queryImageCharacter(imageCharacterId);
        imageCharacter.validUserIsHost(currentUserId);

        imageCharacter.updateName(updateImageCharacterRequest);

        if (imageFile != null && !imageFile.isEmpty()) {
            // 기존 이미지가 있으면 S3에서 삭제
//            if (imageCharacter.getImageUrl() != null && !imageCharacter.getImageUrl().isEmpty()) {
//                s3Service.deleteFile(imageCharacter.getImageUrl());
//            }

            // 새 이미지 업로드
            String imageUrl = s3Service.uploadFile(imageFile, IMAGE_DIRECTORY);
            imageCharacter.updateImageUrl(imageUrl);
        }

        imageCharacterRepository.save(imageCharacter);
        return getImageCharacterResponse(imageCharacter);
    }

    public ImageCharacterResponse getImageCharacterDetail(String imageCharacterId) {

        String currentUserId = SecurityUtils.getCurrentUserId();
        ImageCharacter imageCharacter = queryImageCharacter(imageCharacterId);
        imageCharacter.validUserIsHost(currentUserId);
        return getImageCharacterResponse(imageCharacter);
    }

    public List<ImageCharacterResponse> findAllUsersImageCharacter() {

        String currentUserId = SecurityUtils.getCurrentUserId();
        List<ImageCharacter> characters = imageCharacterRepository.findByUserId(currentUserId);
        return characters.stream().map(this::getImageCharacterResponse).collect(Collectors.toList());
    }

    private ImageCharacter queryImageCharacter(String id) {
        return imageCharacterRepository
                .findById(id)
                .orElseThrow(()-> ImageCharacterNotFoundException.EXCEPTION);
    }

    private ImageCharacter makeImageCharacter(CreateImageCharacterRequest createImageCharacterRequest, String userId, String imageUrl) {

        return ImageCharacter.builder()
                .userId(userId)
                .name(createImageCharacterRequest.getName())
                .imageUrl(imageUrl)
                .wins(0)
                .losses(0)
                .draws(0)
                .eloScore(1000)
                .lastBattleTime(LocalDateTime.now().minusMinutes(2))
                .build();
    }

    private ImageCharacterResponse getImageCharacterResponse(ImageCharacter imageCharacter) {
        return new ImageCharacterResponse(imageCharacter);
    }
}
