package com.appointmentBooking.AppointmentBooking.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Prescriptions {
    private long prescriptionId;
    private long appointmentId;
    private long doctorId;
    private long patientId;
    private String diagnosis;
    private String medication;
    private String advice;
    private LocalDateTime issuedAt;
}
