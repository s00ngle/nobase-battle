package com.ssafy.nobasebattle.global.security.auth;

import com.ssafy.nobasebattle.domain.user.domain.User;
import com.ssafy.nobasebattle.domain.user.domain.repository.UserRepository;
import com.ssafy.nobasebattle.global.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class AuthDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() -> UserNotFoundException.EXCEPTION);
        return new AuthDetails(String.valueOf(user.getId()), user.getAccountRole().getValue());
    }
}
