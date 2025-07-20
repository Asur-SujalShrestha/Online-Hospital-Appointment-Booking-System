package com.user.UserService.Services.Implementations;

import com.user.UserService.DTOs.MailBody;
import com.user.UserService.entities.Users;
import com.user.UserService.repositories.AuthRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.coyote.BadRequestException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final AuthRepository authRepository;

    public EmailService(JavaMailSender mailSender, AuthRepository authRepository) {
        this.mailSender = mailSender;
        this.authRepository = authRepository;
    }

    public void RegisterDoctor(String email) throws BadRequestException {
        Users user = authRepository.findByEmail(email);
        if (user == null) {
            throw new BadRequestException("Please use valid Email.");
        }

        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2E86C1;'>Application for Doctor Received</h2>"
                + "<p>Dear User,</p>"
                + "<p>Your Doctor registration form has been <strong>submitted successfully</strong>.</p>"
                + "<p>Please wait while our admin reviews and approves your request. You will receive a notification once it's approved.</p>"
                + "<p style='margin-top: 20px;'>Thank you for registering with <strong>NepoHeal</strong>.</p>"
                + "<p>Best regards,<br/>NepoHeal Team</p>"
                + "</div>";

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("NepoHeal Doctor Registration")
                .text(htmlContent)
                .isHtml(true)
                .build();

        sendSimpleMessage(mailBody);
    }

    public void sendSimpleMessage(MailBody mailBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(mailBody.to());
            helper.setFrom("asur0825om@gmail.com");
            helper.setSubject(mailBody.subject());

            // Set email body with HTML support
            helper.setText(mailBody.text(), mailBody.isHtml());

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
