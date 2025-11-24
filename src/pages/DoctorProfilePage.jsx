import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const DoctorProfilePage = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        dob: '',
        phone: '',
        role: 'DOCTORS',
        doctor: {
            specialization: '',
            qualification: '',
            experience: '',
            bio: ''
        }
    });
    const [originalData, setOriginalData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Get user ID from JWT token
    const getUserIdFromToken = () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decoded = jwtDecode(token);
                return decoded.id || decoded.userId;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
        return null;
    };

    // Fetch user data
    const fetchUserData = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            setMessage('Please log in to view your profile');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8083/nepoHeal/user/getUserById/${userId}`);
            if (response.ok) {
                const data = await response.json();
                // Store original data for reference
                setOriginalData(data);
                setUserData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    gender: data.gender || '',
                    dob: data.dob ? data.dob.split('T')[0] : '',
                    phone: data.phone || '',
                    role: data.role || 'DOCTORS',
                    password: '',
                    confirmPassword: '',
                    doctor: {
                        specialization: data.doctor?.specialization || '',
                        qualification: data.doctor?.qualification || '',
                        experience: data.doctor?.experience || '',
                        bio: data.doctor?.bio || ''
                    }
                });
            } else {
                setMessage('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage('Error fetching user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (["specialization", "qualification", "experience", "bio"].includes(name)) {
            setUserData((prev) => ({
                ...prev,
                doctor: {
                    ...prev.doctor,
                    [name]: value
                }
            }));
        } else {
            setUserData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Prepare data for submission - only include changed fields
    const prepareSubmitData = () => {
        // Ensure doctor object always exists
        const submitData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            gender: userData.gender,
            dob: userData.dob,
            phone: userData.phone,
            specialization: userData.doctor?.specialization || originalData.doctor?.specialization || '',
            qualification: userData.doctor?.qualification || originalData.doctor?.qualification || '',
            experience: userData.doctor?.experience || originalData.doctor?.experience || '',
            bio: userData.doctor?.bio || originalData.doctor?.bio || ''
        };

        // Remove password fields if they're empty
        if (!submitData.password) {
            delete submitData.password;
            delete submitData.confirmPassword;
        }

        return submitData;
    };


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match if provided
        if (userData.password && userData.password !== userData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            setMessage('Please log in to update your profile');
            return;
        }

        try {
            setLoading(true);
            const submitData = prepareSubmitData();

            const response = await fetch(`http://localhost:8083/nepoHeal/user/updateUserProfile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (response.ok) {
                const result = await response.text();
                toast.success(result);
                setIsEditing(false);
                fetchUserData(); // Refresh data
            } else {
                const errorText = await response.text();
                toast.error(`Failed to update profile: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="text-green-600 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 w-full py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-600 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white">Doctor Profile</h1>
                </div>

                {message && (
                    <div className={`mx-6 mt-4 p-3 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="md:col-span-2">
                            <h2 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">
                                Personal Information
                            </h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={userData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={userData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={userData.dob}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            />
                        </div>



                        {/* Professional Information */}
                        <div className="md:col-span-2 mt-6">
                            <h2 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">
                                Professional Information
                            </h2>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                value={userData.doctor.specialization}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                            <input
                                type="text"
                                name="qualification"
                                value={userData.doctor.qualification}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={userData.doctor.experience}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                value={userData.doctor.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setUserData({
                                            ...originalData,
                                            dob: originalData.dob ? originalData.dob.split('T')[0] : '',
                                            password: '',
                                            confirmPassword: ''
                                        });
                                        setMessage('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfilePage;