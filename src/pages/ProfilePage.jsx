import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../CSS/ProfilePage.css';
import ForgotPassword from './ForgetPassword';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [expandedAppointments, setExpandedAppointments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get user ID from JWT token in localStorage
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Authentication error. Please log in again.');
      return null;
    }
  };

  // Function to get patient ID from JWT token
  const getPatientIdFromToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      const decoded = jwtDecode(token);
      return decoded.patientId;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8083/nepoHeal/user/getUserById/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    const patientId = getPatientIdFromToken();
    if (!patientId){
        console.log("no patient id foun");
        
    }

    try {
      const response = await fetch(`http://localhost:8083/nepoHeal/appointment/get-appointment-by-patientId/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    }
  };

  // Fetch prescriptions for a specific appointment
  const fetchPrescriptions = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:8083/nepoHeal/prescription/getPrescriptionByAppointment/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const data = await response.json();
      
      // Update the appointments state with the fetched prescriptions
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.appointmentId === appointmentId 
            ? { ...app, prescriptions: data } 
            : app
        )
      );
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions');
    }
  };

  // Toggle appointment expansion
  const toggleAppointment = (appointmentId) => {
    setExpandedAppointments(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));

    // If we're expanding and haven't fetched prescriptions yet, fetch them
    if (!expandedAppointments[appointmentId]) {
      const appointment = appointments.find(app => app.appointmentId === appointmentId);
      if (appointment && (!appointment.prescriptions || appointment.prescriptions.length === 0)) {
        fetchPrescriptions(appointmentId);
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUserData();
      await fetchAppointments();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Navigation Section */}
        <div className="navigation-section">
          <div className="profile-header">
            <h2>Patient Profile</h2>
            <div className="user-info">
              {userData && (
                <>
                  <div className="avatar">
                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                  </div>
                  <p>{userData.firstName} {userData.lastName}</p>
                </>
              )}
            </div>
          </div>
          
          <nav className="navigation-tabs">
            <button 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={activeTab === 'appointments' ? 'active' : ''}
              onClick={() => setActiveTab('appointments')}
            >
              My Appointments
            </button>
            <button 
              className={activeTab === 'prescriptions' ? 'active' : ''}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions
            </button>
             <button 
              className={activeTab === 'updatePassword' ? 'active' : ''}
              onClick={() => setActiveTab('updatePassword')}
            >
              Update Password
            </button>
          </nav>
        </div>

        {/* Right Content Section */}
        <div className="content-section">
          {activeTab === 'profile' && userData && (
            <ProfileTab userData={userData} />
          )}
          
          {activeTab === 'appointments' && (
            <AppointmentsTab 
              appointments={appointments} 
              expandedAppointments={expandedAppointments}
              toggleAppointment={toggleAppointment}
            />
          )}
          
          {activeTab === 'prescriptions' && (
            <PrescriptionsTab appointments={appointments} />
          )}

          {activeTab === 'updatePassword' && (
            <ForgotPassword/>
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    gender: userData.gender,
    dob: userData.dob,
    phone: userData.phone,
    bloodGroup: userData.patient?.bloodGroup || '',
    medicalNotes: userData.patient?.medicalNotes || '',
    allergies: userData.patient?.allergies || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = userData.userId;
    
    try {
      const response = await fetch(`http://localhost:8083/nepoHeal/user/updateUserProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully');
        setIsEditing(false);
        // You might want to refetch user data here
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Profile Information</h2>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Medical Notes</label>
            <textarea
              name="medicalNotes"
              value={formData.medicalNotes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              rows="2"
            />
          </div>
          
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-item">
              <label>Name</label>
              <p>{userData.firstName} {userData.lastName}</p>
            </div>
            <div className="detail-item">
              <label>Email</label>
              <p>{userData.email}</p>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <label>Gender</label>
              <p>{userData.gender}</p>
            </div>
            <div className="detail-item">
              <label>Date of Birth</label>
              <p>{userData.dob}</p>
            </div>
          </div>
          
          <div className="detail-item">
            <label>Phone</label>
            <p>{userData.phone}</p>
          </div>
          
          <div className="detail-item">
            <label>Blood Group</label>
            <p>{userData.patient?.bloodGroup || 'Not specified'}</p>
          </div>
          
          <div className="detail-item">
            <label>Medical Notes</label>
            <p>{userData.patient?.medicalNotes || 'None'}</p>
          </div>
          
          <div className="detail-item">
            <label>Allergies</label>
            <p>{userData.patient?.allergies || 'None'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Appointments Tab Component
const AppointmentsTab = ({ appointments, expandedAppointments, toggleAppointment }) => {
  if (appointments.length === 0) {
    return (
      <div className="tab-content">
        <h2>My Appointments</h2>
        <p>No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>My Appointments</h2>
      <div className="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.appointmentId} className="appointment-card">
            <div 
              className="appointment-header"
              onClick={() => toggleAppointment(appointment.appointmentId)}
            >
              <div className="appointment-info">
                <h3>Appointment Id: {appointment.appointmentId}</h3>
                <p>Date: {appointment.appointmentDate} at {appointment.appointmentTime}</p>
                <p>Status: <span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span></p>
              </div>
              <span className="toggle-icon">
                {expandedAppointments[appointment.appointmentId] ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedAppointments[appointment.appointmentId] && (
              <div className="appointment-details">
                <p><strong>Notes:</strong> {appointment.notes || 'No notes available'}</p>
                <p><strong>Booked at:</strong> {new Date(appointment.bookedAt).toLocaleString()}</p>
                
                {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
                  <div className="prescriptions-section">
                    <h4>Prescriptions</h4>
                    {appointment.prescriptions.map(prescription => (
                      <div key={prescription.prescriptionId} className="prescription-card">
                        <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                        <p><strong>Medication:</strong> {prescription.medication}</p>
                        <p><strong>Advice:</strong> {prescription.advice}</p>
                        <p><strong>Issued at:</strong> {new Date(prescription.issuedAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No prescriptions available for this appointment.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Prescriptions Tab Component
const PrescriptionsTab = ({ appointments }) => {
  // Extract all prescriptions from all appointments
  const allPrescriptions = appointments.flatMap(appointment => 
    appointment.prescriptions || []
  );

  if (allPrescriptions.length === 0) {
    return (
      <div className="tab-content">
        <h2>My Prescriptions</h2>
        <p>No prescriptions found.</p>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <h2>My Prescriptions</h2>
      <div className="prescriptions-list">
        {allPrescriptions.map(prescription => (
          <div key={prescription.prescriptionId} className="prescription-card">
            <h3>Prescription #{prescription.prescriptionId}</h3>
            <p><strong>Appointment ID:</strong> {prescription.appointmentId}</p>
            <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
            <p><strong>Medication:</strong> {prescription.medication}</p>
            <p><strong>Advice:</strong> {prescription.advice}</p>
            <p><strong>Issued at:</strong> {new Date(prescription.issuedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;