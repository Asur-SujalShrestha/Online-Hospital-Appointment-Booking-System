package com.prescription.PrescriptionService.Entites;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Prescriptions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long prescriptionId;
    private long appointmentId;
    private long doctorId;
    private long patientId;
    private String diagnosis;
    private String medication;
    private String advice;
    private LocalDateTime issuedAt;
}
