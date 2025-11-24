import React, { useState } from 'react';
import { Calendar, Clock, Users, FileText, MessageSquare, Settings, Bell, CheckCircle, XCircle } from 'lucide-react';
import { appointments, prescriptions, doctors, patients } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  // Mock data - in real app, this would come from API based on doctor ID
  const doctorAppointments = appointments.filter(apt => apt.doctorId === user?.id).map(apt => ({
    ...apt,
    patient: patients.find(p => p.id === apt.patientId)
  }));

  const doctorPrescriptions = prescriptions.filter(presc => presc.doctorId === user?.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAppointmentAction = (appointmentId, action) => {
    // In real app, this would update the appointment status via API
    console.log(`${action} appointment ${appointmentId}`);
    alert(`Appointment ${action}ed successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h1>
              <p className="mt-1 text-gray-600">{user?.specialization} • {user?.experience} years experience</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={24} />
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600">Today's Appointments</div>
                <div className="text-2xl font-bold text-primary-600">
                  {doctorAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="text-primary-600" size={24} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{doctorAppointments.length}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Clock className="text-yellow-600" size={24} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {doctorAppointments.filter(apt => apt.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="text-green-600" size={24} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(doctorAppointments.map(apt => apt.patientId)).size}
                </div>
                <div className="text-sm text-gray-600">Patients</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <FileText className="text-blue-600" size={24} />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{doctorPrescriptions.length}</div>
                <div className="text-sm text-gray-600">Prescriptions</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.image || 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. {user?.name}</h3>
                    <p className="text-sm text-gray-600">{user?.specialization}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'appointments' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar size={20} />
                      <span>Appointments</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'schedule' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Clock size={20} />
                      <span>Schedule</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'prescriptions' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FileText size={20} />
                      <span>Prescriptions</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('patients')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'patients' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Users size={20} />
                      <span>Patients</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'messages' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <MessageSquare size={20} />
                      <span>Messages</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === 'profile' 
                          ? 'bg-primary-100 text-primary-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Settings size={20} />
                      <span>Profile Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Appointment Requests</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {doctorAppointments.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments yet</h3>
                        <p className="mt-2 text-gray-600">Appointment requests will appear here</p>
                      </div>
                    ) : (
                      doctorAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                <Users className="text-primary-600" size={20} />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.patient?.name || 'Patient'}</h3>
                                <p className="text-sm text-gray-600">{appointment.reason}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Calendar className="text-gray-400" size={14} />
                                  <span className="text-sm text-gray-600">{formatDate(appointment.date)}</span>
                                  <Clock className="text-gray-400 ml-2" size={14} />
                                  <span className="text-sm text-gray-600">{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              {appointment.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    title="Confirm"
                                  >
                                    <CheckCircle size={20} />
                                  </button>
                                  <button
                                    onClick={() => handleAppointmentAction(appointment.id, 'reject')}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Reject"
                                  >
                                    <XCircle size={20} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">My Schedule</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Available Days</h3>
                      <div className="space-y-2">
                        {user?.availableDays?.map(day => (
                          <div key={day} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                            <span className="font-medium text-primary-900">{day}</span>
                            <span className="text-sm text-primary-600">Available</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Time Slots</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {user?.timeSlots?.map(time => (
                          <div key={time} className="text-center p-2 bg-gray-100 rounded text-sm">
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Prescriptions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {doctorPrescriptions.length === 0 ? (
                    <div className="p-8 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No prescriptions yet</h3>
                      <p className="mt-2 text-gray-600">Prescriptions you create will appear here</p>
                    </div>
                  ) : (
                    doctorPrescriptions.map((prescription) => {
                      const patient = patients.find(p => p.id === prescription.patientId);
                      return (
                        <div key={prescription.id} className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">Patient: {patient?.name || 'Unknown'}</h3>
                              <p className="text-sm text-gray-600">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Prescribed Medications:</h4>
                            {prescription.medicines.map((medicine, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                                    <p className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</p>
                                    <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>
                                  </div>
                                </div>
                                {medicine.instructions && (
                                  <p className="text-sm text-gray-700 mt-2 italic">Instructions: {medicine.instructions}</p>
                                )}
                              </div>
                            ))}
                            
                            {prescription.notes && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900">Notes:</h4>
                                <p className="text-sm text-gray-700 mt-1">{prescription.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">My Patients</h2>
                </div>
                <div className="p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Patient records</h3>
                  <p className="mt-2 text-gray-600">Manage your patient information and history</p>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                </div>
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
                  <p className="mt-2 text-gray-600">Patient messages will appear here</p>
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                </div>
                <div className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.specialization}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={user?.phone}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          defaultValue={user?.experience}
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualifications
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={user?.qualifications}
                        className="input"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary">
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;