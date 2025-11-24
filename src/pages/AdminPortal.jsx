import { useState, useEffect } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchAppointments(),
        fetchPrescriptions()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8083/nepoHeal/user/all-user');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8083/nepoHeal/appointment/getAllAppointment');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:8083/nepoHeal/prescription/get-all-prescription');
      if (!response.ok) throw new Error('Failed to fetch prescriptions');
      const data = await response.json();
      setPrescriptions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateDoctorStatus = async (doctorId, status) => {
    try {
      const response = await fetch(`http://localhost:8083/nepoHeal/user/updateDoctorStatus/${doctorId}?status=${status}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) throw new Error('Failed to update doctor status');
      
      // Refresh users data
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const totalDoctors = users.filter(user => user.role === 'DOCTORS').length;
  const totalPatients = users.filter(user => user.role === 'PATIENTS').length;
  const totalAppointments = appointments.length;
  const totalPrescriptions = prescriptions.length;

  // Appointment status counts
  const appointmentStatusCounts = appointments.reduce((acc, appointment) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {});

  // Doctor appointment counts
const doctorAppointmentCounts = appointments.reduce((acc, appointment) => {
  const doctorId = appointment.doctorId;
  if (doctorId) {
    // Use doctorId as the key, not doctorName
    acc[doctorId] = (acc[doctorId] || 0) + 1;
  }
  return acc;
}, {});
  // Prepare data for charts
  const appointmentStatusData = {
    labels: Object.keys(appointmentStatusCounts),
    datasets: [
      {
        data: Object.values(appointmentStatusCounts),
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)', // PENDING - Yellow
          'rgba(75, 192, 192, 0.7)', // ACCEPTED - Teal
          'rgba(54, 162, 235, 0.7)', // COMPLETED - Blue
          'rgba(255, 99, 132, 0.7)', // REJECTED - Red
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare doctor appointment data for bar chart
  const doctorAppointmentData = {
  labels: Object.keys(doctorAppointmentCounts).map(doctorId => {
    // Find the doctor in users array to get their name
    const doctor = users.find(user => 
      user.doctor && user.doctor.doctor_id === parseInt(doctorId)
    );
    // Return doctor name if found, otherwise use ID
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : `Doctor ${doctorId}`;
  }),
  datasets: [
    {
      label: 'Number of Appointments',
      data: Object.values(doctorAppointmentCounts),
      backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 1)','rgba(255, 99, 132, 0.7)'],
      borderColor: ['rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 1)','rgba(255, 99, 132, 0.7)'],
      borderWidth: 1,
    },
  ],
};

  // Filter users based on selected type
  const filteredUsers = userTypeFilter === 'all' 
    ? users 
    : users.filter(user => user.role === (userTypeFilter === 'doctors' ? 'DOCTORS' : 'PATIENTS'));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 flex">

        <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-green-700 text-white focus:outline-none"
        >
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}


      {/* Sidebar */}
      <div className={`w-64 bg-green-800 text-white shadow-lg fixed lg:static inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-5 border-b border-green-700">
          <h1 className="text-xl font-bold">NepoHeal Admin</h1>
          <p className="text-green-200 text-sm">Administrator Portal</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700'}`}
              >
                <i className="fas fa-tachometer-alt mr-3"></i> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab('users');
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700'}`}
              >
                <i className="fas fa-users mr-3"></i> User Management
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab('appointments');
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700'}`}
              >
                <i className="fas fa-calendar-alt mr-3"></i> Appointments
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab('prescriptions');
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'prescriptions' ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-700'}`}
              >
                <i className="fas fa-prescription mr-3"></i> Prescriptions
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-2xl font-bold text-green-900">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'appointments' && 'Appointments'}
              {activeTab === 'prescriptions' && 'Prescriptions'}
            </h2>
            <button 
              onClick={fetchAllData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh Data
            </button>
          </div>
        </header>

        <main className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>Error: {error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-red-800 underline">
                Dismiss
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>
                    <i className="fas fa-users text-3xl text-blue-500"></i>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Doctors</p>
                      <p className="text-3xl font-bold">{totalDoctors}</p>
                    </div>
                    <i className="fas fa-user-md text-3xl text-green-500"></i>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Appointments</p>
                      <p className="text-3xl font-bold">{totalAppointments}</p>
                    </div>
                    <i className="fas fa-calendar-check text-3xl text-purple-500"></i>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Prescriptions</p>
                      <p className="text-3xl font-bold">{totalPrescriptions}</p>
                    </div>
                    <i className="fas fa-prescription text-3xl text-yellow-500"></i>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Appointment Status Distribution</h3>
                  <div className="h-64">
                    <Doughnut 
                      data={appointmentStatusData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Doctor Appointments</h3>
                  <div className="h-64">
                    <Bar 
                      data={doctorAppointmentData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Recent Appointments Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Recent Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.slice(0, 5).map(appointment => (
                        <tr key={appointment.appointmentId}>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.doctorName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">User Management</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setUserTypeFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${userTypeFilter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      All Users
                    </button>
                    <button
                      onClick={() => setUserTypeFilter('doctors')}
                      className={`px-3 py-1 rounded-full text-sm ${userTypeFilter === 'doctors' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Doctors
                    </button>
                    <button
                      onClick={() => setUserTypeFilter('patients')}
                      className={`px-3 py-1 rounded-full text-sm ${userTypeFilter === 'patients' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Patients
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.userId}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.userId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.firstName} {user.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'DOCTORS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.doctor && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.doctor.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                user.doctor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {user.doctor.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.role === 'DOCTORS' && user.doctor && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateDoctorStatus(user.doctor.doctor_id, 'APPROVED')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                                  disabled={user.doctor.status === 'APPROVED'}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateDoctorStatus(user.doctor.doctor_id, 'REJECTED')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                                  disabled={user.doctor.status === 'REJECTED'}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">All Appointments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map(appointment => (
                      <tr key={appointment.appointmentId}>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.doctorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">All Prescriptions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Issued At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prescriptions.map(prescription => (
                      <tr key={prescription.prescriptionId}>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.prescriptionId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.appointmentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.doctorId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.patientId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{prescription.medication}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(prescription.issuedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;