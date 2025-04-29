package com.ssafy.nobasebattle.global.utils.user;

import com.ssafy.nobasebattle.domain.user.domain.User;
import com.ssafy.nobasebattle.domain.user.domain.repository.UserRepository;
import com.ssafy.nobasebattle.global.exception.UserNotFoundException;
import com.ssafy.nobasebattle.global.utils.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserUtilsImpl implements UserUtils{

    private final UserRepository userRepository;


    @Override
    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> UserNotFoundException.EXCEPTION);
    }

    @Override
    public User getUserFromSecurityContext() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        return getUserById(currentUserId);
    }

}
