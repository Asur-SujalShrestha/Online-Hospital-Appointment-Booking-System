package com.user.UserService.Controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import com.user.UserService.Config.JwtUtil;
import com.user.UserService.DTOs.GoogleTokenDTO;
import com.user.UserService.DTOs.ResponseDTO;
import com.user.UserService.entities.Users;
import com.user.UserService.repositories.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RestController
@RequestMapping("/nepoHeal/googleAuth")
@RequiredArgsConstructor
public class GoogleAuthController {
    private final AuthRepository authRepository;
    private final JwtUtil jwtUtil;
    @Value("${google.client-id}")
    private String clientId;

    @PostMapping("/google")
    public ResponseEntity<ResponseDTO> googleLogin(@RequestBody GoogleTokenDTO token) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId)).build();

        GoogleIdToken idToken = verifier.verify(token.getToken());
        if(idToken == null) {
            throw new RuntimeException("Invalid token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("sub");

        Users user = authRepository.findByEmail(email).orElseGet(()->{
            Users newUser = new Users();
            newUser.setEmail(email);
            newUser.setFirstName(name);
            newUser.setRole(Users.Roles.PATIENTS);
            authRepository.save(newUser);
            return newUser;
        });
        return ResponseEntity.ok(jwtUtil.generateToken(name, user));
    }
}
