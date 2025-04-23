package com.ssafy.nobasebattle.domain.imagecharacter.presentation;

import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request.CreateImageCharacterRequest;
import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request.UpdateImageCharacterRequest;
import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.response.ImageCharacterResponse;
import com.ssafy.nobasebattle.domain.imagecharacter.service.ImageCharacterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/characters/image")
@RestController
public class ImageCharacterController {

    private final ImageCharacterService imageCharacterService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImageCharacterResponse createImageCharacter(
            @RequestPart("data") CreateImageCharacterRequest characterRequest,
            @RequestPart("image") MultipartFile imageFile) {
        return imageCharacterService.createImageCharacter(characterRequest, imageFile);
    }

    @DeleteMapping("/{id}")
    public void deleteImageCharacter(@PathVariable("id") String imageCharacterId) {
        imageCharacterService.deleteImageCharacter(imageCharacterId);
    }

    @PatchMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImageCharacterResponse updateImageCharacter(
            @PathVariable("id") String imageCharacterId,
            @RequestPart("data") UpdateImageCharacterRequest updateImageCharacterRequest,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return imageCharacterService.updateImageCharacter(imageCharacterId, updateImageCharacterRequest, imageFile);
    }

    @GetMapping("/{id}")
    public ImageCharacterResponse getImageCharacterDetail(@PathVariable("id") String imageCharacterId) {
        return imageCharacterService.getImageCharacterDetail(imageCharacterId);
    }

    @GetMapping
    public List<ImageCharacterResponse> findUserImageCharacter() {
        return imageCharacterService.findAllUsersImageCharacter();
    }

}
