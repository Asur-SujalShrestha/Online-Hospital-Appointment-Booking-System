package com.appointmentBooking.AppointmentBooking.DTOs;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddedAppointmentResponse {
    private long doctorId;
    private long patientId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private LocalDateTime bookedAt;
    private String status;
}
