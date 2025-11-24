import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('PATIENTS');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    phone: '',
    role: 'PATIENTS',
    specialization: '',
    qualification: '',
    experience: 0,
    bio: '',
    bloodGroup: '',
    medicalNotes: '',
    allergies: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    if (userType === 'doctor') {
      if (!formData.specialization) newErrors.specialization = 'Specialization is required';
      if (!formData.qualification) newErrors.qualification = 'Qualification is required';
      if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        role: userType
      };
      
      const response = await axios.post('http://localhost:8081/nepoHeal/auth/register', payload);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform and get access to amazing features
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setUserType('PATIENTS')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                      userType === 'PATIENTS'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('DOCTORS')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                      userType === 'DOCTORS'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder='Enter your first name'
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.firstName ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder='Enter your last name'
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.lastName ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder='Enter your email address'
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.email ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder='Enter your phone number'
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.phone ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.password ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder='Enter same password to confirm'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.gender ? 'border-red-500' : 'border'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                      errors.dob ? 'border-red-500' : 'border'
                    }`}
                  />
                  {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                </div>
              </div>

              {/* Doctor Specific Fields */}
              {userType === 'DOCTORS' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Doctor Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        placeholder='Enter your specialization'
                        value={formData.specialization}
                        onChange={handleChange}
                        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                          errors.specialization ? 'border-red-500' : 'border'
                        }`}
                      />
                      {errors.specialization && (
                        <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                        Qualification *
                      </label>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        placeholder='Enter your qualification'
                        value={formData.qualification}
                        onChange={handleChange}
                        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                          errors.qualification ? 'border-red-500' : 'border'
                        }`}
                      />
                      {errors.qualification && (
                        <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="experience"
                        name="experience"
                        min="0"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                          errors.experience ? 'border-red-500' : 'border'
                        }`}
                      />
                      {errors.experience && (
                        <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        placeholder='Enter something about you'
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Specific Fields */}
              {userType === 'PATIENTS' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
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

                    <div className="sm:col-span-2">
                      <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                        Allergies
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="List any allergies separated by commas"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="medicalNotes" className="block text-sm font-medium text-gray-700">
                        Medical Notes
                      </label>
                      <textarea
                        id="medicalNotes"
                        name="medicalNotes"
                        rows={3}
                        value={formData.medicalNotes}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="Any important medical information"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span>Already have an account? </span>
                  <a href="/login" className="font-medium text-green-600 hover:text-green-500">
                    Sign in
                  </a>
                </div>

                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;