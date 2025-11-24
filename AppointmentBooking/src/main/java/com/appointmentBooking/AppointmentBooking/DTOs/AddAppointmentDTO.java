package com.appointmentBooking.AppointmentBooking.DTOs;

import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddAppointmentDTO {
    private long doctorId;
    private long patientId;
    private String patientEmail;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String notes;
}
