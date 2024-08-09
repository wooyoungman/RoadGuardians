package com.c104.guardians.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Login {
    @NotBlank   // *spring-boot-starter-validation, 필수값
    private String Id;
    @NotBlank
    private  String password;
    @NotBlank
    private  String userType;
}
