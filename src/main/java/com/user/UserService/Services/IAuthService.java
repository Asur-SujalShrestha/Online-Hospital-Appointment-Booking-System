package com.user.UserService.Services;

import com.user.UserService.DTOs.LoginDTO;
import com.user.UserService.DTOs.RegisterResponseDTO;
import com.user.UserService.DTOs.ResponseDTO;
import com.user.UserService.DTOs.UserDTO;
import com.user.UserService.entities.Users;
import org.apache.coyote.BadRequestException;

public interface IAuthService {

    public RegisterResponseDTO registerUser(UserDTO userDto) throws BadRequestException;
    public ResponseDTO loginUser(LoginDTO loginDto) throws BadRequestException;
}
