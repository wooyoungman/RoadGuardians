// AuthService.java
package com.c104.guardians.service;

import com.c104.guardians.dto.Login;
import com.c104.guardians.dto.LoginResponse;
import com.c104.guardians.dto.Response;
import com.c104.guardians.dto.SignUp;
import com.c104.guardians.entity.Department;
import com.c104.guardians.entity.User;
import com.c104.guardians.repository.DepartmentRepository;
import com.c104.guardians.repository.UserRepository;
import com.c104.guardians.Security.TokenProvider;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired TokenProvider tokenProvider;
    @Autowired DepartmentRepository departmentRepository;

    public Response<?> signUp(SignUp dto) {
        String id = dto.getId();
        String password = dto.getPassword();
        Integer deptId = dto.getDeptId();

        try {
            if(userRepository.existsById(id)) {
                return Response.setFailed("중복된 id 입니다.");
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        Department department = departmentRepository.findById(deptId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid department ID"));

        User userEntity = new User(dto, department);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if(!isPasswordMatch) {
            return Response.setFailed("암호화에 실패하였습니다.");
        }

        userEntity.setPassword(hashedPassword);

        try {
            userRepository.save(userEntity);
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return Response.setSuccess("회원 생성에 성공했습니다.");
    }

    @Transactional
    public Response<LoginResponse> login(Login dto, HttpServletResponse response) {
        String id = dto.getId();
        String password = dto.getPassword();
        String userType = dto.getUserType();
        User userEntity = userRepository.findById(id).orElse(null);
        try {
            if (userEntity == null) {
                return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
            }
            if (!userEntity.getUserType().equals(userType)) {
                return Response.setFailed("유저 타입이 일치하지 않습니다.");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = userEntity.getPassword();

            if (!passwordEncoder.matches(password, encodedPassword)) {
                return Response.setFailed("비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        int accessTokenDuration = 3600; // 1 hour
        int refreshTokenDuration = 1209600; // 2 weeks
        String accessToken = tokenProvider.createAccessToken(id, accessTokenDuration);
        String refreshToken = tokenProvider.createRefreshToken(id, refreshTokenDuration);

        userEntity.setToken(refreshToken);
        userRepository.saveAndFlush(userEntity);

        // Refresh Token 쿠키 설정
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true); // JavaScript에서 접근 불가
        refreshTokenCookie.setSecure(true); // HTTPS를 사용하는 경우에만 적용
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenDuration);
        response.addCookie(refreshTokenCookie);

        if (accessToken == null || refreshToken == null) {
            return Response.setFailed("토큰 생성에 실패하였습니다.");
        }

        LoginResponse loginResponseDto = new LoginResponse(accessToken, accessTokenDuration, refreshToken, refreshTokenDuration, userEntity);

        return Response.setSuccessData("로그인에 성공 하였습니다.", loginResponseDto);
    }
}