import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaPhone,
  FaMapMarkerAlt,
  FaHospital,
  FaChevronLeft,
} from "react-icons/fa";
import {
  MdHealthAndSafety,
  MdWork,
  MdSchool,
  MdAccessTime,
} from "react-icons/md";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const DoctorDetailPage = () => {
  const { id } = useParams(); // doctorId from URL
  const [doctor, setDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const token = localStorage.getItem("authToken")?.replace(/^"(.*)"$/, '$1');
  const patientId = token ? jwtDecode(token).id : null;

  // Fetch doctor by id
  useEffect(() => {
    fetch(`http://localhost:8083/nepoHeal/user/get-doctorDetailById/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch doctor details");
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.doctor) {
          setDoctor({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            gender: data.gender,
            dob: data.dob,
            phone: data.phone,
            role: data.role,
            doctor: {
              doctor_id: data.doctor.doctor_id,
              specialization: data.doctor.specialization,
              qualification: data.doctor.qualification,
              experience: data.doctor.experience,
              status: data.doctor.status,
              bio: data.doctor.bio,
              schedule: data.doctor.schedule || [],
            }
          });
        } else {
          throw new Error("Doctor data not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching doctor:", err);
        toast.error("Doctor not found");
      });
  }, [id]);

  // Generate 30-min slots
  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}`;
      slots.push(formatTime(timeStr));

      m += 30;
      if (m >= 60) {
        m = 0;
        h += 1;
      }
    }
    return slots;
  };

  // Format 24h -> 12h
  const formatTime = (time) => {
    let [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // Book appointment
const handleBookAppointment = async (e) => {
  e.preventDefault();

  if (!selectedDay || !selectedTime) {
    toast.error("Please select a day and time");
    return;
  }

  // Convert selected time (e.g., "3:30 PM") back to 24h "HH:mm"
  const parseTimeTo24h = (timeStr) => {
    let [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const appointmentRequest = {
    doctorId: doctor.doctor.doctor_id,
    patientId: patientId, 
    patientEmail,
    appointmentDate: new Date().toISOString().split("T")[0], 
    appointmentTime: parseTimeTo24h(selectedTime),
    notes: appointmentReason,
  };

  try {
    const res = await fetch("http://localhost:8083/nepoHeal/appointment/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentRequest),
    });

    if (!res.ok) {
      throw new Error("Failed to book appointment");
    }

    const data = await res.json();
    toast.success("Appointment booked successfully!");
    console.log("Booked Appointment:", data);

    // Reset form
    setIsBookingSuccess(true);
    setTimeout(() => {
      setIsBookingSuccess(false);
      setSelectedDay(null);
      setSelectedTime(null);
      setPatientName("");
      setPatientPhone("");
      setPatientEmail("");
      setAppointmentReason("");
    }, 3000);

  } catch (err) {
    console.error("Booking error:", err);
    toast.error("Failed to book appointment. Try again later.");
  }
};


  
  // Book appointment
  // const handleBookAppointment = (e) => {
  //   e.preventDefault();
  //   console.log({
  //     doctorId: doctor.doctor.doctor_id,
  //     day: selectedDay,
  //     time: selectedTime,
  //     patientName,
  //     patientPhone,
  //     patientEmail,
  //     reason: appointmentReason,
  //   });
  //   setIsBookingSuccess(true);
  //   setTimeout(() => {
  //     setIsBookingSuccess(false);
  //     setSelectedDay(null);
  //     setSelectedTime(null);
  //     setPatientName("");
  //     setPatientPhone("");
  //     setPatientEmail("");
  //     setAppointmentReason("");
  //   }, 3000);
  // };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading doctor details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/doctors"
          className="flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          <FaChevronLeft className="mr-2" />
          Back to Doctors List
        </Link>

        {/* Doctor Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <FaUserMd className="text-green-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="text-xl text-green-600 font-semibold">
                {doctor.doctor.specialization} Specialist
              </p>
              <div className="flex items-center mt-1">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-gray-600">4.8 (120 reviews)</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{doctor.doctor.bio}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center">
              <MdWork className="text-green-500 mr-2 text-lg" />
              <span>{doctor.doctor.experience} years experience</span>
            </div>
            <div className="flex items-center">
              <MdSchool className="text-green-500 mr-2 text-lg" />
              <span>{doctor.doctor.qualification}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-green-500 mr-2 text-lg" />
              <span>{doctor.phone}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 ${
              activeTab === "overview"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("appointment")}
            className={`px-4 py-2 ${
              activeTab === "appointment"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Book Appointment
          </button>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Availability Schedule</h2>
            {doctor.doctor.schedule && doctor.doctor.schedule.length > 0 ? (
              <div className="space-y-4">
                {doctor.doctor.schedule.map((day, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium capitalize">{day.dayOfWeek.toLowerCase()}</span>
                    <div className="flex items-center">
                      <FaClock className="text-green-500 mr-2" />
                      <span>
                        {formatTime(day.startTime)} - {formatTime(day.endTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No schedule available</p>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">About Dr. {doctor.firstName}</h3>
              <p className="text-gray-700">{doctor.doctor.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <MdHealthAndSafety className="text-green-500 mr-2 text-xl" />
                  <span>Specialization: {doctor.doctor.specialization}</span>
                </div>
                <div className="flex items-center">
                  <MdWork className="text-green-500 mr-2 text-xl" />
                  <span>Experience: {doctor.doctor.experience} years</span>
                </div>
                <div className="flex items-center">
                  <MdSchool className="text-green-500 mr-2 text-xl" />
                  <span>Qualification: {doctor.doctor.qualification}</span>
                </div>
                <div className="flex items-center">
                  <FaHospital className="text-green-500 mr-2 text-xl" />
                  <span>Status: {doctor.doctor.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment */}
        {activeTab === "appointment" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Book Appointment with Dr. {doctor.firstName}</h2>

            {isBookingSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Appointment booked successfully! We'll contact you shortly.
              </div>
            )}

            {/* Day selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Day</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.doctor.schedule && doctor.doctor.schedule.length > 0 ? (
                  doctor.doctor.schedule.map((day, i) => (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded border transition-colors ${
                        selectedDay === day.dayOfWeek
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedDay(day.dayOfWeek);
                        setSelectedTime(null);
                      }}
                    >
                      {day.dayOfWeek}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No available days</p>
                )}
              </div>
            </div>

            {/* Time slots */}
            {selectedDay && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Available Time Slots</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.doctor.schedule
                    .filter((d) => d.dayOfWeek === selectedDay)
                    .flatMap((d) => generateTimeSlots(d.startTime, d.endTime))
                    .map((time, i) => (
                      <button
                        key={i}
                        className={`px-4 py-2 rounded border transition-colors ${
                          selectedTime === time
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Booking form */}
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Appointment
                </label>
                <textarea
                  placeholder="Please describe your symptoms or reason for the appointment"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!selectedDay || !selectedTime}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                  selectedDay && selectedTime
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailPage;