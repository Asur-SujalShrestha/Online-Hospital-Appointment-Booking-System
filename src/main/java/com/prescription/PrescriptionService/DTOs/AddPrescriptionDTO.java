package com.prescription.PrescriptionService.DTOs;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddPrescriptionDTO {
    private long appointmentId;
    private long doctorId;
    private long patientId;
    private String diagnosis;
    private String medication;
    private String advice;
}
