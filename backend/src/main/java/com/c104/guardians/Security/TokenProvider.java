package com.c104.guardians.Security;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import com.nimbusds.jose.*;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;

import java.time.Instant;
import java.util.Date;

import javax.annotation.PostConstruct;


@Service
public class TokenProvider {
    private static String SECURITY_KEY;

    @Value("${jwt.security.key}")
    private String securityKey;

    @PostConstruct
    public void init() {
        SECURITY_KEY = securityKey;
    }

//    // JWT 생성 메서드
//    public String createJwt(String id, int duration) {
//        try {
//            // 현재 시간 기준 1시간 뒤로 만료시간 설정
//            Instant now = Instant.now();
//            Instant exprTime = now.plusSeconds(duration);
//
//            // JWT Claim 설정
//            // *Claim 집합 << 내용 설정 (페이로드 설정)
//            // subject << "sub", issuer << "iss", expiration time << "exp" ....
//            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
//                    .subject(id)
//                    .issueTime(Date.from(now))
//                    .expirationTime(Date.from(exprTime))
//                    .build();
//
//            // JWT 서명
//            SignedJWT signedJWT = new SignedJWT(
//                    new JWSHeader(JWSAlgorithm.HS256),	// *헤더 설정
//                    claimsSet
//            );
//
//            // HMAC 서명을 사용하여 JWT 서명
//            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());	// *서명 설정
//            signedJWT.sign(signer);
//
//            return signedJWT.serialize();
//        } catch (JOSEException e) {
//            return null;
//        }
//    }
    // JWT 생성 메서드 (액세스 토큰)
    public String createAccessToken(String id, int duration) {
        return createJwt(id, duration, "access");
    }

    // JWT 생성 메서드 (리프레시 토큰)
    public String createRefreshToken(String id, int duration) {
        return createJwt(id, duration, "refresh");
    }

    // JWT 생성 메서드 (공용)
    private String createJwt(String id, int duration, String tokenType) {
        try {
            Instant now = Instant.now();
            Instant exprTime = now.plusSeconds(duration);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(id)
                    .claim("type", tokenType) // 토큰 타입 추가
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exprTime))
                    .build();

            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),
                    claimsSet
            );

            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            return null;
        }
    }
    // JWT 검증 메서드
    public String validateJwt(String token) {
        try {
            // 서명 확인을 통한 JWT 검증
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes());
            if (signedJWT.verify(verifier)) {
                // 만료시간 확인
                Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
                if (expirationTime != null && expirationTime.before(new Date())) {
                    return null;
                }
                return signedJWT.getJWTClaimsSet().getSubject();
            } else {
                // 서명이 유효하지 않은 경우
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
}