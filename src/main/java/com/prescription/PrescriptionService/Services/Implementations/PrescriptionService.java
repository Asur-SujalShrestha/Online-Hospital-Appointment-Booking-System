package com.prescription.PrescriptionService.Services.Implementations;

import com.prescription.PrescriptionService.DTOs.AddPrescriptionDTO;
import com.prescription.PrescriptionService.DTOs.DoctorDTO;
import com.prescription.PrescriptionService.Entites.Prescriptions;
import com.prescription.PrescriptionService.Repositories.PrescriptionRepository;
import com.prescription.PrescriptionService.Services.AppointmentPrescriptionClient;
import com.prescription.PrescriptionService.Services.IPrescriptionService;
import com.prescription.PrescriptionService.Services.UserPrescriptionClient;
import jakarta.ws.rs.NotFoundException;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrescriptionService implements IPrescriptionService {
    private final UserPrescriptionClient userPrescriptionClient;
    private final AppointmentPrescriptionClient appointmentPrescriptionClient;
    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(UserPrescriptionClient userPrescriptionClient, AppointmentPrescriptionClient appointmentPrescriptionClient, PrescriptionRepository prescriptionRepository) {
        this.userPrescriptionClient = userPrescriptionClient;
        this.appointmentPrescriptionClient = appointmentPrescriptionClient;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Override
    @Transactional
    public String addPrescriptionService(AddPrescriptionDTO prescriptionDTO) throws BadRequestException {
        //Check Doctor id is present or not
        DoctorDTO doctorDTO = userPrescriptionClient.getDoctorById(prescriptionDTO.getDoctorId());
        if (doctorDTO == null) {
            throw new BadRequestException("Doctor not found");
        }

        // Check is patient id exist or not
        boolean patientResult = userPrescriptionClient.isPatientExist(prescriptionDTO.getPatientId());
        if (!patientResult) {
            throw new BadRequestException("Patient not found");
        }

        //Check if appointment id exist or not
        boolean appointmentResult = appointmentPrescriptionClient.appointmentExist(prescriptionDTO.getAppointmentId());
        if (!appointmentResult) {
            throw new BadRequestException("Appointment not found");
        }

        Prescriptions prescriptions = Prescriptions.builder()
                .patientId(prescriptionDTO.getPatientId())
                .doctorId(prescriptionDTO.getDoctorId())
                .appointmentId(prescriptionDTO.getAppointmentId())
                .diagnosis(prescriptionDTO.getDiagnosis())
                .medication(prescriptionDTO.getMedication())
                .advice(prescriptionDTO.getAdvice())
                .issuedAt(LocalDateTime.now())
                .build();

        prescriptionRepository.save(prescriptions);
        return "Prescription added successfully";
    }

    @Override
    public List<Prescriptions> getAllPrescription() {
        return prescriptionRepository.findAll();
    }

    @Override
    public List<Prescriptions> getPrescriptionByDoctorId(long doctorId) {
        // Check if the doctor id exist
        DoctorDTO doctor = userPrescriptionClient.getDoctorById(doctorId);
        if (doctor == null) {
            throw new NotFoundException("Doctor not found");
        }
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    @Override
    public List<Prescriptions> getPrescriptionByPatientId(long patientId) {
        if(!userPrescriptionClient.isPatientExist(patientId)) {
            throw new NotFoundException("Patient not found");
        }
        return prescriptionRepository.findByPatientId(patientId);
    }

    @Override
    public List<Prescriptions> getPrescriptionByAppointmentId(long appointmentId) {
        boolean result = appointmentPrescriptionClient.appointmentExist(appointmentId);
        if (!result) {
            throw new NotFoundException("Appointment not found");
        }
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }
}
