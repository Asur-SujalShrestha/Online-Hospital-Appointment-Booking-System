package com.appointmentBooking.AppointmentBooking.Repositories;

import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointments, Long> {
    Appointments findByDoctorIdAndAppointmentDateAndAppointmentTime(long doctorId, LocalDate appointmentDate, LocalTime appointmentTime);

    List<Appointments> findByDoctorId(Long doctorId);

    List<Appointments> findByPatientId(Long patientId);
}
