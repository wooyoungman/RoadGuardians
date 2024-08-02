package com.c104.guardians;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.FileInputStream;
import java.io.IOException;

@SpringBootApplication
public class GuardiansApplication {

	public static void main(String[] args) {
//		try {
//			FileInputStream serviceAccount =
//					new FileInputStream("src/main/resources/serviceAccountKey.json");
//
//			FirebaseOptions options = new FirebaseOptions.Builder()
//					.setCredentials(GoogleCredentials.fromStream(serviceAccount))
//					.build();
//
//			FirebaseApp.initializeApp(options);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}

		SpringApplication.run(GuardiansApplication.class, args);
	}

}
