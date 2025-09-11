package com.appointmentBooking.AppointmentBooking.DTOs;

import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetAppointmentDTO {
    private long appointmentId;
    private long doctorId;
    private String doctorName;
    private long patientId;
    private String patientName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private LocalDateTime bookedAt;
    private String notes;
    private String status;
    private List<Prescriptions> prescriptions;
}
