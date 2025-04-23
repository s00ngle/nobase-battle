package com.ssafy.nobasebattle.domain.imagecharacter.presentation;

import com.ssafy.nobasebattle.domain.imagecharacter.service.ImageCharacterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/characters/image")
@RestController
public class ImageCharacterController {

    private final ImageCharacterService imageCharacterService;

//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ApiResponse<ImageCharacterResponse>> createImageCharacter(
//            @RequestParam("name") String name,
//            @RequestParam("image") MultipartFile image,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        ImageCharacterResponse response = imageCharacterService.createImageCharacter(
//                userDetails.getUsername(), name, image);
//
//        return ResponseEntity
//                .status(HttpStatus.CREATED)
//                .body(ApiResponse.success(response));
//    }

}
