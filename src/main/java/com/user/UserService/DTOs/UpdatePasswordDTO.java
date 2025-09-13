package com.user.UserService.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePasswordDTO {
    private long userId;
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
