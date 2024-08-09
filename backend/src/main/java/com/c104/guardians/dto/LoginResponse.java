package com.c104.guardians.dto;

import com.c104.guardians.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String accessToken;
    private int accessTokenDuration;
    private String refreshToken;
    private int refreshTokenDuration; // 리프레시 토큰 유효기간 추가
    private User user;
}