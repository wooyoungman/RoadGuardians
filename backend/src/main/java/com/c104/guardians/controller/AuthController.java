package com.c104.guardians.controller;

import com.c104.guardians.Security.TokenProvider;
import com.c104.guardians.dto.Response;
import com.c104.guardians.dto.SignUp;
import com.c104.guardians.dto.Login;
import com.c104.guardians.repository.UserRepository;
import com.c104.guardians.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired AuthService authService;
    @Autowired UserRepository userRepository;
    @Autowired TokenProvider tokenProvider;
    @GetMapping("/check-id")
    public Response<?> checkId(@RequestParam String id) {
        boolean exists = userRepository.existsById(id);
        if (exists) {
            return Response.setFailed("중복되는 id가 존재합니다.");
        } else {
            return Response.setSuccess("사용 가능한 id입니다.");
        }
    }
    @PostMapping("/signUp")
    public Response<?> signUp(@RequestBody SignUp requestBody) {
        Response<?> result = authService.signUp(requestBody);
        return result;
    }
    @PostMapping("/login")
    public Response<?> login(@RequestBody Login requestBody) {
        Response<?> result = authService.login(requestBody);
        return result;
    }
    @GetMapping("/check-token")
    public Response<?> checkToken(@RequestHeader("Authorization") String token) {
        // "Bearer " 문자열 제거
        token = token.substring(7);

        String userId = tokenProvider.validateJwt(token);
        if (userId == null) {
            return Response.setFailed("엑세스토큰이 유효하지 않습니다.");
        }

        return Response.setSuccess("엑세스토큰이 유효합니다.");
    }
    @PostMapping("/refresh-token")
    public Response<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String userId = tokenProvider.validateJwt(refreshToken);
        if (userId == null) {
            return Response.setFailed("리프레시 토큰이 유효하지 않습니다.");
        }

        int accessTokenDuration = 3600; // 1 hour
        String accessToken = tokenProvider.createAccessToken(userId, accessTokenDuration);

        if (accessToken == null) {
            return Response.setFailed("엑세스토큰 생성에 실패하였습니다.");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("accessToken", accessToken);

        return Response.setSuccessData("엑세스토큰 재발급에 성공하였습니다.", data);
    }
}
