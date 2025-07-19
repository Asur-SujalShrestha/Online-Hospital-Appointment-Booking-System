package com.user.UserService.DTOs;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class RegisterResponseDTO {
    private String firstName;
    private String lastName;
    private String email;
}
