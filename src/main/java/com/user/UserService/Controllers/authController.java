package com.user.UserService.Controllers;

import com.user.UserService.DTOs.LoginDTO;
import com.user.UserService.DTOs.RegisterResponseDTO;
import com.user.UserService.DTOs.ResponseDTO;
import com.user.UserService.DTOs.UserDTO;
import com.user.UserService.Services.Implementations.AuthService;
import com.user.UserService.entities.Users;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nepoHeal/auth")
public class authController {
    private final AuthService authService;

    public authController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody UserDTO userDto) throws BadRequestException {
        if(!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm password should match");
        }
        RegisterResponseDTO user = authService.registerUser(userDto);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody LoginDTO loginDTO) throws BadRequestException {
        ResponseDTO response = authService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
    }


    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> exceptionHandler(BadRequestException ex){
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }


}
