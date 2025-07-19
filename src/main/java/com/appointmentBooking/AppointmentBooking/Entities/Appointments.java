package com.appointmentBooking.AppointmentBooking.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Appointments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long appointmentId;
    private long doctorId;
    private long patientId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private LocalDateTime bookedAt;
    @Length(max = 100, message = "Notes must not exceed 100 characters")
    private String notes;
    private Status status;

    public enum Status{
        PENDING, APPROVED, COMPLETED, CANCELLED
    }
}
