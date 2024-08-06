package com.c104.guardians.service;

import com.c104.guardians.dto.Login;
import com.c104.guardians.dto.LoginResponse;
import com.c104.guardians.dto.Response;
import com.c104.guardians.dto.SignUp;
import com.c104.guardians.entity.User;
import com.c104.guardians.repository.UserRepository;
import com.c104.guardians.Security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class AuthService {
    @Autowired UserRepository userRepository;
    @Autowired TokenProvider tokenProvider;
    public Response<?> signUp(SignUp dto) {
        String id = dto.getId();
        String password = dto.getPassword();
        // id 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if(userRepository.existsById(id)) {
                return Response.setFailed("중복된 id 입니다.");
            }
        } catch (Exception e) {

            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
        }


        // UserEntity 생성
        User userEntity = new User(dto);

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(password);

        boolean isPasswordMatch = passwordEncoder.matches(password, hashedPassword);

        if(!isPasswordMatch) {
            return Response.setFailed("암호화에 실패하였습니다.");
        }

        userEntity.setPassword(hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            userRepository.save(userEntity);
        } catch (Exception e) {
            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return Response.setSuccess("회원 생성에 성공했습니다.");
    }

//    public Response<LoginResponse> login(Login dto) {
//        String id = dto.getId();
//        String password = dto.getPassword();
//        User userEntity;
//        try {
//            // 사용자 id/password 일치하는지 확인
////            boolean existed = userRepository.existsByIdAndPassword(id, password);
////            if(!existed) {
////                return Response.setFailed("입력하신 로그인 정보가 존재하지 않습니다.");
////            }
//            // 아이디로 사용자 정보 가져오기
//            userEntity=userRepository.findById(id).orElse(null);
//            if(userEntity==null){
//              return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
//            }
//
//            // 사용자가 입력한 비밀번호를 BCryptPasswordEncoder를 사용하여 암호화
//            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//            String encodedPassword = userEntity.getPassword();
//
//            // 저장된 암호화된 비밀번호와 입력된 암호화된 비밀번호 비교
//            if(!passwordEncoder.matches(password, encodedPassword)) {
//                return Response.setFailed("비밀번호가 일치하지 않습니다.");
//            }
//        } catch (Exception e) {
//            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
//        }
//
//
//
////        try {
////            // 값이 존재하는 경우 사용자 정보 불러옴 (id 기준으로 조회)
////            userEntity = userRepository.findById(id).get();
////        } catch (Exception e) {
////            return Response.setFailed("데이터베이스 연결에 실패하였습니다.");
////        }
//
//        // 클라이언트에게 비밀번호 제공 방지
//        userEntity.setPassword("");
//        String name = userEntity.getName();
//
////        String token = "";
////        int exprTime = 3600000;     // 1h
//        int exprTime = 3600;     // 1h
//        String token = tokenProvider.createJwt(id, exprTime);
//
//        if(token == null) {
//            return Response.setFailed("토큰 생성에 실패하였습니다.");
//        }
//
//        LoginResponse loginResponseDto = new LoginResponse(token, exprTime, userEntity);
//
//        return Response.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
//    }
public Response<LoginResponse> login(Login dto) {
    String id = dto.getId();
    String password = dto.getPassword();
    String userType = dto.getUserType();
    User userEntity;
    try {
        userEntity = userRepository.findById(id).orElse(null);
        if (userEntity == null) {
            return Response.setFailed("입력하신 아이디로 등록된 계정이 존재하지 않습니다.");
        }
        if (!userEntity.getUserType().equals(userType)) {
            System.out.println("Database userType: " + userEntity.getUserType());
            System.out.println("Provided userType: " + userType);
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

    userEntity.setPassword("");

    int accessTokenDuration = 3600; // 1 hour
    int refreshTokenDuration = 1209600; // 2 weeks
    String accessToken = tokenProvider.createAccessToken(id, accessTokenDuration);
    String refreshToken = tokenProvider.createRefreshToken(id, refreshTokenDuration);

    if (accessToken == null || refreshToken == null) {
        return Response.setFailed("토큰 생성에 실패하였습니다.");
    }

    LoginResponse loginResponseDto = new LoginResponse(accessToken, accessTokenDuration, refreshToken, refreshTokenDuration, userEntity);

    return Response.setSuccessData("로그인에 성공하였습니다.", loginResponseDto);
}
}
