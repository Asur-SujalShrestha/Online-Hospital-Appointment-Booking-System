package com.appointmentBooking.AppointmentBooking.Services;

import com.appointmentBooking.AppointmentBooking.DTOs.AddAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.AddedAppointmentResponse;
import com.appointmentBooking.AppointmentBooking.DTOs.UpdateAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface IAppointmentService {
    AddedAppointmentResponse addAppointment(AddAppointmentDTO appointmentDto) throws BadRequestException;

    List<Appointments> getAppointmentByDoctorId(Long doctorId) throws BadRequestException;

    List<Appointments> getAppointmentByPatientId(Long patientId) throws BadRequestException;

    boolean checkAppointment(Long appointmentId);

    String updateAppointment(Long appointmentId, UpdateAppointmentDTO updateAppointmentDTO) throws BadRequestException;

    String deleteAppointment(Long appointmentId) throws BadRequestException;

    String updateAppointmentStatus(Long appointmentId, String status) throws BadRequestException;
}
