package com.user.UserService.Services;

import com.user.UserService.DTOs.OTPVerfiyDTO;
import jakarta.mail.MessagingException;
import org.apache.coyote.BadRequestException;

public interface IForgetPasswordService {
    String addNewForgetPassword(String email) throws BadRequestException, MessagingException;

    String verifyOTP(OTPVerfiyDTO verfiyDTO) throws BadRequestException;
}
