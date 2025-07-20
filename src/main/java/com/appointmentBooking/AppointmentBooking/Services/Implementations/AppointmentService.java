package com.appointmentBooking.AppointmentBooking.Services.Implementations;

import com.appointmentBooking.AppointmentBooking.DTOs.AddAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.AddedAppointmentResponse;
import com.appointmentBooking.AppointmentBooking.DTOs.DoctorDTO;
import com.appointmentBooking.AppointmentBooking.DTOs.UpdateAppointmentDTO;
import com.appointmentBooking.AppointmentBooking.Entities.Appointments;
import com.appointmentBooking.AppointmentBooking.Repositories.AppointmentRepository;
import com.appointmentBooking.AppointmentBooking.Services.DoctorClient;
import com.appointmentBooking.AppointmentBooking.Services.IAppointmentService;
import com.appointmentBooking.AppointmentBooking.Services.PrescriptionClient;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class AppointmentService implements IAppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorClient doctorClient;
    private final PrescriptionClient prescriptionClient;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorClient doctorClient, PrescriptionClient prescriptionClient) {
        this.appointmentRepository = appointmentRepository;
        this.doctorClient = doctorClient;
        this.prescriptionClient = prescriptionClient;
    }

    @Override
    public AddedAppointmentResponse addAppointment(AddAppointmentDTO appointmentDto) throws BadRequestException {
        DoctorDTO doctorDTO = doctorClient.getDoctor(appointmentDto.getDoctorId());
        if(doctorDTO == null) {
            throw new BadRequestException("Doctor not found");
        }

        if(!doctorClient.isPatientExist(appointmentDto.getPatientId())) {
            throw new BadRequestException("Patient not found");
        }

        Appointments bookedAppointment = appointmentRepository.findByDoctorIdAndAppointmentDateAndAppointmentTime(appointmentDto.getDoctorId(), appointmentDto.getAppointmentDate(), appointmentDto.getAppointmentTime());
        if(bookedAppointment != null) {
            throw new BadRequestException("This time slot is already booked for the doctor");
        }
        Appointments newAppointment = Appointments.builder()
                .doctorId(appointmentDto.getDoctorId())
                .appointmentDate(appointmentDto.getAppointmentDate())
                .appointmentTime(appointmentDto.getAppointmentTime())
                .notes(appointmentDto.getNotes())
                .patientId(appointmentDto.getPatientId())
                .bookedAt(LocalDateTime.now())
                .status(Appointments.Status.PENDING)
                .build();

        appointmentRepository.save(newAppointment);
        return AddedAppointmentResponse.builder()
                .doctorId(newAppointment.getDoctorId())
                .patientId(newAppointment.getPatientId())
                .appointmentDate(newAppointment.getAppointmentDate())
                .appointmentTime(newAppointment.getAppointmentTime())
                .bookedAt(newAppointment.getBookedAt())
                .status(String.valueOf(newAppointment.getStatus()))
                .build();
    }

    @Override
    public List<Appointments> getAllAppointments() {
        List<Appointments> appointmentsList = appointmentRepository.findAll();
        return appointmentsList.stream().map(appointment -> {
            appointment.setPrescriptions(prescriptionClient.getPrescriptionByAppointment(appointment.getAppointmentId()));
            return appointment;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Appointments> getAppointmentByDoctorId(Long doctorId) throws BadRequestException {
        DoctorDTO doctorDTO = doctorClient.getDoctor(doctorId);
        if(doctorDTO == null) {
            throw new BadRequestException("Doctor not found");
        }
        List<Appointments> appointmentsList =  appointmentRepository.findByDoctorId(doctorId);
        return appointmentsList.stream().map(appointments -> {
            appointments.setPrescriptions(prescriptionClient.getPrescriptionByAppointment(appointments.getAppointmentId()));
            return appointments;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Appointments> getAppointmentByPatientId(Long patientId) throws BadRequestException {
        if(!doctorClient.isPatientExist(patientId)){
            throw new BadRequestException("Patient not found");
        }
        List<Appointments> appointmentsList = appointmentRepository.findByPatientId(patientId);
        return appointmentsList.stream().map(appointments -> {
            appointments.setPrescriptions(prescriptionClient.getPrescriptionByAppointment(appointments.getAppointmentId()));
            return appointments;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean checkAppointment(Long appointmentId) {
        Appointments appointments = appointmentRepository.findById(appointmentId).orElse(null);
        return appointments != null;
    }

    @Override
    public String updateAppointment(Long appointmentId, UpdateAppointmentDTO updateAppointmentDTO) throws BadRequestException {
        Appointments appointments = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointments.setAppointmentDate(updateAppointmentDTO.getAppointmentDate());
        appointments.setAppointmentTime(updateAppointmentDTO.getAppointmentTime());
        appointmentRepository.save(appointments);
        return "Appointment Updated Successfully";
    }

    @Override
    public String deleteAppointment(Long appointmentId) throws BadRequestException {
        Appointments appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointmentRepository.delete(appointment);
        return "Appointment Deleted Successfully";
    }

    @Override
    public String updateAppointmentStatus(Long appointmentId, String status) throws BadRequestException {
        Appointments appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new BadRequestException("Appointment not found"));
        appointment.setStatus(Enum.valueOf(Appointments.Status.class, status.toUpperCase()));
        appointmentRepository.save(appointment);
        return "Appointment Updated Successfully";
    }


}
