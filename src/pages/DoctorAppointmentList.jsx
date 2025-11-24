import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import { FaHospital } from 'react-icons/fa';
import DoctorSideBar from './DoctorSideBar';
import DoctorProfilePage from './DoctorProfilePage';
import DoctorSchedulePage from './DoctorSchedulePage';

const DoctorAppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
     const [sideBarActiveTab, setSideBarActiveTab] = useState('appointments');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [prescriptionForm, setPrescriptionForm] = useState({
        diagnosis: '',
        medication: '',
        advice: ''
    });
    const [activeTab, setActiveTab] = useState('all');

    // Get doctorId from token
    const getDoctorId = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentication token not found');
            return null;
        }
        
        const decodedToken = jwtDecode(token);
        if (!decodedToken || !decodedToken.doctorId) {
            setError('Doctor ID not found in token');
            return null;
        }
        
        return decodedToken.doctorId;
    };

    // Fetch appointments from API
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const doctorId = getDoctorId();
            if (!doctorId) return;
            
            const response = await fetch(`http://localhost:8083/nepoHeal/appointment/get-appointment-by-doctorId/${doctorId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch appointments: ${response.status}`);
            }
            
            const data = await response.json();
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update appointment status
    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            const response = await fetch(`http://localhost:8083/nepoHeal/appointment/updateAppointmentStatus/${appointmentId}?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update appointment status: ${response.status}`);
            }
            
            // Update local state
            setAppointments(prevAppointments => 
                prevAppointments.map(app => 
                    app.appointmentId === appointmentId ? { ...app, status } : app
                )
            );
            
            // If selected appointment is the one updated, update it too
            if (selectedAppointment && selectedAppointment.appointmentId === appointmentId) {
                setSelectedAppointment({ ...selectedAppointment, status });
            }
            
        } catch (err) {
            setError(err.message);
            console.error('Error updating appointment status:', err);
        }
    };

    // Add prescription
    const addPrescription = async (e) => {
        e.preventDefault();
        try {
            const doctorId = getDoctorId();
            if (!doctorId) return;
            
            const prescriptionData = {
                appointmentId: selectedAppointment.appointmentId,
                doctorId: doctorId,
                patientId: selectedAppointment.patientId,
                diagnosis: prescriptionForm.diagnosis,
                medication: prescriptionForm.medication,
                advice: prescriptionForm.advice
            };
            
            const response = await fetch('http://localhost:8083/nepoHeal/prescription/add-prescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(prescriptionData)
            });
            
            if (!response.ok) {
                throw new Error(`Failed to add prescription: ${response.status}`);
            }
            
            fetchAppointments();
            
            setPrescriptionForm({ diagnosis: '', medication: '', advice: '' });
            setShowPrescriptionModal(false);
            
        } catch (err) {
            setError(err.message);
            console.error('Error adding prescription:', err);
        }
    };

    // Fetch appointments on component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments based on active tab
    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'all') return true;
        return app.status === activeTab;
    });

    // Render loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-green-800">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-green-50">
            {/* Header */}
            <div className=''>
                <DoctorSideBar activeTab={sideBarActiveTab} setActiveTab={setSideBarActiveTab}/>
            </div>
            
            {sideBarActiveTab === "appointments" && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 flex-5 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-green-900">Appointment Management</h2>
                    <p className="text-green-700">View and manage your patient appointments</p>
                </div>

                {/* Appointment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                        <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
                        <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'PENDING').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700">Accepted</h3>
                        <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'APPROVED').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                        <h3 className="text-lg font-semibold text-gray-700">Rejected</h3>
                        <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'CANCELLED').length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
                        <p className="text-3xl font-bold">{appointments.filter(a => a.status === 'COMPLETED').length}</p>
                    </div>
                </div>

                {/* Appointments List and Details */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Appointments List */}
                    <div className="w-full lg:w-2/5">
                        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <h2 className="text-xl font-semibold text-green-900 mb-4">Appointment Requests</h2>
                            
                            {/* Filter Tabs */}
                            <div className="flex space-x-2 mb-4 overflow-x-auto">
                                <button 
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1 rounded-full text-sm ${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setActiveTab('PENDING')}
                                    className={`px-3 py-1 rounded-full text-sm ${activeTab === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}
                                >
                                    Pending
                                </button>
                                <button 
                                    onClick={() => setActiveTab('APPROVED')}
                                    className={`px-3 py-1 rounded-full text-sm ${activeTab === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}
                                >
                                    Accepted
                                </button>
                                <button 
                                    onClick={() => setActiveTab('COMPLETED')}
                                    className={`px-3 py-1 rounded-full text-sm ${activeTab === 'COMPLETED' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
                                >
                                    Completed
                                </button>
                            </div>
                            
                            {filteredAppointments.length === 0 ? (
                                <div className="bg-green-50 rounded-lg p-6 text-center">
                                    <i className="fas fa-calendar-times text-4xl text-green-400 mb-4"></i>
                                    <p className="text-green-700">No appointments found</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {filteredAppointments.map(appointment => (
                                        <div 
                                            key={appointment.appointmentId} 
                                            className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md border ${
                                                selectedAppointment && selectedAppointment.appointmentId === appointment.appointmentId 
                                                ? 'border-green-500 bg-green-50' 
                                                : 'border-gray-200'
                                            }`}
                                            onClick={() => setSelectedAppointment(appointment)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-green-900">Patient Name: {appointment.patientName}</h3>
                                                    <p className="text-gray-600 text-sm">Appointment id: {appointment.appointmentId}</p>
                                                    <p className="text-gray-600 text-sm">
                                                        {appointment.appointmentDate} at {appointment.appointmentTime}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {appointment.status}
                                                </span>
                                            </div>
                                            
                                            {appointment.status === 'PENDING' && (
                                                <div className="flex space-x-2 mt-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateAppointmentStatus(appointment.appointmentId, 'APPROVED');
                                                        }}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                                                    >
                                                        <i className="fas fa-check mr-1"></i> Accept
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateAppointmentStatus(appointment.appointmentId, 'CANCELLED');
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                                    >
                                                        <i className="fas fa-times mr-1"></i> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="w-full lg:w-3/5">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-green-900 mb-6">Appointment Details</h2>
                            
                            {!selectedAppointment ? (
                                <div className="bg-green-50 rounded-lg p-8 text-center">
                                    <i className="fas fa-calendar-check text-4xl text-green-400 mb-4"></i>
                                    <p className="text-green-700">Select an appointment to view details</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-900">Appointment id: {selectedAppointment.appointmentId}</h3>
                                            <p className="text-gray-600">Patient Name: {selectedAppointment.patientName}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            selectedAppointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedAppointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            selectedAppointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">Patient Name</p>
                                            <p className="font-semibold">{selectedAppointment.patientName}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">Doctor Name</p>
                                            <p className="font-semibold">{selectedAppointment.doctorName}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">Date</p>
                                            <p className="font-semibold">{selectedAppointment.appointmentDate}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">Time</p>
                                            <p className="font-semibold">{selectedAppointment.appointmentTime}</p>
                                        </div>
                                        <div className="md:col-span-2 bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">Booked At</p>
                                            <p className="font-semibold">{new Date(selectedAppointment.bookedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-sm text-green-700 font-medium mb-2">Notes</p>
                                        <p className="bg-green-50 p-4 rounded-lg">{selectedAppointment.notes || 'No notes provided'}</p>
                                    </div>
                                    
                                    {/* Prescriptions Section */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-semibold text-green-900">Prescriptions</h4>
                                            <div className='flex gap-2'>

                                            
                                            {selectedAppointment.status === 'APPROVED' && (
                                                <>
                                                <button className='bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center' 
                                                onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateAppointmentStatus(selectedAppointment.appointmentId, 'COMPLETED');
                                                        }}>Completed</button>
                                                <button 
                                                    onClick={() => setShowPrescriptionModal(true)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center"
                                                >
                                                    <i className="fas fa-plus mr-2"></i> Add Prescription
                                                </button>
                                                </>
                                            )}
                                            </div>
                                        </div>
                                        
                                        {selectedAppointment.prescriptions && selectedAppointment.prescriptions.length > 0 ? (
                                            <div className="space-y-4">
                                                {selectedAppointment.prescriptions.map(prescription => (
                                                    <div key={prescription.prescriptionId} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <p className="font-semibold text-green-900">{prescription.diagnosis}</p>
                                                            <p className="text-xs text-green-700">
                                                                {new Date(prescription.issuedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-green-800 mb-1"><span className="font-medium">Medication:</span> {prescription.medication}</p>
                                                        <p className="text-sm text-green-800"><span className="font-medium">Advice:</span> {prescription.advice}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                                <p className="text-green-700">No prescriptions yet</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    {selectedAppointment.status === 'PENDING' && (
                                        <div className="flex space-x-4">
                                            <button 
                                                onClick={() => updateAppointmentStatus(selectedAppointment.appointmentId, 'APPROVED')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center"
                                            >
                                                <i className="fas fa-check-circle mr-2"></i> Accept Appointment
                                            </button>
                                            <button 
                                                onClick={() => updateAppointmentStatus(selectedAppointment.appointmentId, 'CANCELLED')}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center"
                                            >
                                                <i className="fas fa-times-circle mr-2"></i> Reject Appointment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            )}

            {sideBarActiveTab === "profile" && (
                <DoctorProfilePage/>
            )}

            {sideBarActiveTab === "schedule" && (
                <DoctorSchedulePage/>
            )}

            {/* Prescription Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        
                        <div className="px-6 py-4 border-b border-green-200">
                            <h3 className="text-xl font-semibold text-green-900">Add Prescription</h3>
                        </div>
                        <form onSubmit={addPrescription} className="px-6 py-4">
                            <div className="mb-4">
                                <label className="block text-green-700 text-sm font-medium mb-2" htmlFor="diagnosis">
                                    Diagnosis
                                </label>
                                <input
                                    id="diagnosis"
                                    type="text"
                                    required
                                    value={prescriptionForm.diagnosis}
                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, diagnosis: e.target.value})}
                                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter diagnosis"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-green-700 text-sm font-medium mb-2" htmlFor="medication">
                                    Medication
                                </label>
                                <textarea
                                    id="medication"
                                    required
                                    value={prescriptionForm.medication}
                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, medication: e.target.value})}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Prescribe medications and dosage"
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-green-700 text-sm font-medium mb-2" htmlFor="advice">
                                    Advice
                                </label>
                                <textarea
                                    id="advice"
                                    required
                                    value={prescriptionForm.advice}
                                    onChange={(e) => setPrescriptionForm({...prescriptionForm, advice: e.target.value})}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Provide advice and follow-up instructions"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPrescriptionModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Prescription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-4">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointmentList;