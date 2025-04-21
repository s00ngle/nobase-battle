package com.ssafy.nobasebattle.global.utils.user;


import com.ssafy.nobasebattle.domain.user.domain.User;

public interface UserUtils {

    User getUserById(String id);
    User getUserFromSecurityContext();

}
