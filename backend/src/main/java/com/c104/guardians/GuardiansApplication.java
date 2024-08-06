package com.c104.guardians;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.FileInputStream;
import java.io.IOException;

@SpringBootApplication
@EnableScheduling
public class GuardiansApplication {

	public static void main(String[] args) {

		SpringApplication.run(GuardiansApplication.class, args);
	}

}

