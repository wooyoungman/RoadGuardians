package com.c104.guardians;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.TimeZone;


@SpringBootApplication
public class GuardiansApplication {

	public static void main(String[] args) {

		SpringApplication.run(GuardiansApplication.class, args);
	}

}
