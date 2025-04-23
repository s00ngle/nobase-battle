package com.ssafy.nobasebattle.domain.imagecharacter.service;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class ImageCharacterService {

    private final ImageCharacterRepository imageCharacterRepository;

}
