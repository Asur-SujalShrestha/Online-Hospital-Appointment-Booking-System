import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, FileText, MessageSquare, Settings, Bell, Plus } from 'lucide-react';
import { appointments, prescriptions, doctors } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  // Mock data - in real app, this would come from API based on user ID
  const userAppointments = appointments.map(apt => ({
    ...apt,
    doctor: doctors.find(d => d.id === apt.doctorId)
  }));

  const userPrescriptions = prescriptions;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="mt-1 text-gray-600">Manage your health appointments and records</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={24} />
              </button>
              <Link to="/doctors" className="btn btn-primary">
                <Plus className="mr-2" size={16} />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-600">Patient</p>
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
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">My Appointments</h2>
                      <Link to="/doctors" className="btn btn-primary">
                        Book New Appointment
                      </Link>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {userAppointments.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments yet</h3>
                        <p className="mt-2 text-gray-600">Book your first appointment with our doctors</p>
                        <Link to="/doctors" className="mt-4 btn btn-primary">
                          Find a Doctor
                        </Link>
                      </div>
                    ) : (
                      userAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={appointment.doctor.image}
                                alt={appointment.doctor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-900">{appointment.doctor.name}</h3>
                                <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Calendar className="text-gray-400" size={14} />
                                  <span className="text-sm text-gray-600">{formatDate(appointment.date)}</span>
                                  <Clock className="text-gray-400 ml-2" size={14} />
                                  <span className="text-sm text-gray-600">{appointment.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">My Prescriptions</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {userPrescriptions.length === 0 ? (
                      <div className="p-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No prescriptions yet</h3>
                        <p className="mt-2 text-gray-600">Your prescriptions will appear here after doctor consultations</p>
                      </div>
                    ) : (
                      userPrescriptions.map((prescription) => {
                        const doctor = doctors.find(d => d.id === prescription.doctorId);
                        return (
                          <div key={prescription.id} className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">Prescription from Dr. {doctor?.name}</h3>
                                <p className="text-sm text-gray-600">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Medications:</h4>
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
                                  <h4 className="font-medium text-gray-900">Doctor's Notes:</h4>
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
                  <p className="mt-2 text-gray-600">Start a conversation with your doctors</p>
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
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          defaultValue={user?.dateOfBirth}
                          className="input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        rows={3}
                        defaultValue={user?.address}
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

export default PatientDashboard;