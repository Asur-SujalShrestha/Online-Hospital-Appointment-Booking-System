import { useState, useEffect } from "react";
import {
  FaSearch,
  FaUserMd,
  FaFilter,
  FaStar,
  FaRegStar,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { Link } from "react-router-dom";

const DoctorListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors from backend
  useEffect(() => {
    fetch("http://localhost:8083/nepoHeal/user/allDoctors")
      .then((res) => res.json())
      .then((data) => {
        // Transform API response
        const formattedDoctors = data
          .filter((d) => d.role === "DOCTORS" && d.doctor?.status === "APPROVED")
          .map((d) => ({
            id: d.userId,
            doctorId: d.doctor?.doctor_id,
            name: `${d.firstName} ${d.lastName}`,
            specialty: d.doctor?.specialization || "N/A",
            department: d.doctor?.specialization || "General",
            rating: 4.5, // backend does not provide rating → use default/fake
            experience: `${d.doctor?.experience || 0} years`,
            image: `https://ui-avatars.com/api/?name=${d.firstName}+${d.lastName}`,
            available:
              d.doctor?.schedule?.length > 0
                ? d.doctor.schedule
                    .map((s) => s.dayOfWeek.charAt(0) + s.dayOfWeek.slice(1).toLowerCase())
                    .join(", ")
                : "Not Available",
            education: `${d.doctor?.qualification || ""}, ${d.doctor?.bio || ""}`,
            phone: d.phone,
          }));
        setDoctors(formattedDoctors);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  // Unique departments
  const departments = ["All", ...new Set(doctors.map((doctor) => doctor.department))];

  // Filtered doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || doctor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Rating UI
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Specialist Doctors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our team of experienced healthcare professionals dedicated to your well-being
          </p>
        </div>

        {/* Search + Filter */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              className="md:hidden flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition duration-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              Filters
            </button>

            {/* Department Filter (Desktop) */}
            <div className="hidden md:flex items-center">
              <label htmlFor="department" className="mr-3 text-gray-700">
                Department:
              </label>
              <select
                id="department"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 md:hidden">
              <label htmlFor="mobile-department" className="block mb-2 text-gray-700">
                Department:
              </label>
              <select
                id="mobile-department"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Doctor Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredDoctors.length}</span> doctors
            {selectedDepartment !== "All" && ` in ${selectedDepartment}`}
          </p>
        </div>

        {/* Doctors List */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-green-600">{doctor.specialty}</p>
                      <div className="mt-1">{renderRating(doctor.rating)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <MdHealthAndSafety className="mr-2 text-green-500" />
                      <span>{doctor.department} Department</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaUserMd className="mr-2 text-green-500" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <FaCalendarAlt className="mr-2 text-green-500" />
                      <span>Available: {doctor.available}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">{doctor.education}</p>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Link
                      to={`/doctors/${doctor.doctorId}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-center transition duration-300 flex items-center justify-center"
                    >
                      <FaCalendarAlt className="mr-2" />
                      Book Appointment
                    </Link>
                    <a
                      href={`tel:${doctor.phone}`}
                      className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <FaPhone />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaUserMd className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDepartment("All");
              }}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorListPage;
