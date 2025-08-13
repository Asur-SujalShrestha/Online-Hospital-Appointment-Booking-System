package com.user.UserService.Services.Implementations;

import com.user.UserService.DTOs.OTPVerfiyDTO;
import com.user.UserService.Services.IForgetPasswordService;
import com.user.UserService.entities.ForgetPassword;
import com.user.UserService.entities.Users;
import com.user.UserService.repositories.AuthRepository;
import com.user.UserService.repositories.ForgetPasswordRepository;
import jakarta.mail.MessagingException;
import org.apache.coyote.BadRequestException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Random;

@Service
public class ForgetPasswordService implements IForgetPasswordService {
    private final AuthRepository authRepository;
    private final ForgetPasswordRepository forgetPasswordRepository;
    private final EmailService emailService;

    public ForgetPasswordService(AuthRepository authRepository, ForgetPasswordRepository forgetPasswordRepository, EmailService emailService) {
        this.authRepository = authRepository;
        this.forgetPasswordRepository = forgetPasswordRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public String addNewForgetPassword(String email) throws BadRequestException, MessagingException {
        Users user = authRepository.findByEmail(email).orElse(null);
        if(user == null) {
            throw new BadRequestException("User not found");
        }

        int otp = generateOTP();
        ForgetPassword forgetPassword = ForgetPassword.builder()
                .token(otp)
                .expires(LocalDateTime.now().plusMinutes(1))
                .user(user)
                .build();
        forgetPasswordRepository.save(forgetPassword);
        emailService.forgetPasswordMail(user.getEmail(), otp);
        return "OTP is sent to your email.";
    }

    @Override
    public String verifyOTP(OTPVerfiyDTO verfiyDTO) throws BadRequestException {
        Users user = authRepository.findByEmail(verfiyDTO.getEmail()).orElse(null);
        if(user == null) {
            throw new BadRequestException("User not found");
        }
        ForgetPassword forgetPassword = forgetPasswordRepository.findByUser(user);
        if(forgetPassword == null || verfiyDTO.getOtp() == null || (verfiyDTO.getOtp() != forgetPassword.getToken())) {
            throw new BadCredentialsException("Invalid OTP");
        }

        if(forgetPassword.getExpires().isBefore(LocalDateTime.now())) {
            forgetPasswordRepository.delete(forgetPassword);
            throw new BadCredentialsException("Expired OTP");
        }

        forgetPasswordRepository.delete(forgetPassword);
        return "OTP verified";

    }

    public Integer generateOTP(){
        Random rand = new Random();
        return rand.nextInt(100000,999999);
    }
}
