package com.appointmentBooking.AppointmentBooking.Services.Implementations;

import com.appointmentBooking.AppointmentBooking.DTOs.DoctorDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.MailBody;
import com.appointmentBooking.AppointmentBooking.DTOs.UserDTO;
import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import com.appointmentBooking.AppointmentBooking.Repositories.AppointmentRepository;
import com.appointmentBooking.AppointmentBooking.Services.DoctorClient;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.coyote.BadRequestException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void addAppointment(String email, Appointments appointment) throws BadRequestException {
        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                + "<h2 style='color: #2E86C1;'>Appointment Booking</h2>"
                + "<p>Dear User,</p>"
                + "<p>Your Appointment booking form has been <strong>submitted successfully</strong> for</p>" + appointment.getAppointmentDate() + " - " + appointment.getAppointmentTime()
                + "<p>Please wait while our doctors reviews and approves your request. You will receive a notification once it's approved.</p>"
                + "<p style='margin-top: 20px;'>Thank you for using out service with <strong>NepoHeal</strong>.</p>"
                + "<p>Best regards,<br/>NepoHeal Team</p>"
                + "</div>";

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("NepoHeal Appointment Booking")
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
