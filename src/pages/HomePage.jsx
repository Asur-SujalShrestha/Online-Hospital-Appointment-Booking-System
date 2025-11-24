import { FaAmbulance, FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaUserMd, FaProcedures, FaHeartbeat, FaEnvelope } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

const HomePage = () => {
  // Sample data - replace with your actual data
  const services = [
    { icon: <FaUserMd className="text-4xl text-green-600" />, title: "Expert Doctors", description: "Qualified healthcare professionals" },
    { icon: <FaProcedures className="text-4xl text-green-600" />, title: "Modern Equipment", description: "State-of-the-art medical technology" },
    { icon: <MdHealthAndSafety className="text-4xl text-green-600" />, title: "Emergency Care", description: "24/7 emergency services" },
    { icon: <FaHeartbeat className="text-4xl text-green-600" />, title: "Health Checkups", description: "Comprehensive health packages" },
  ];

  const doctors = [
    { name: "Dr. Sarah Johnson", specialty: "Cardiology", image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Dr. Michael Chen", specialty: "Neurology", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Dr. Emily Wilson", specialty: "Pediatrics", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Dr. Robert Garcia", specialty: "Orthopedics", image: "https://randomuser.me/api/portraits/men/75.jpg" },
  ];

  return (
    <div className=""> {/* Padding to account for fixed navbar */}
      {/* Hero Section */}
      <section className="relative bg-green-700 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Health Is Our Priority</h1>
            <p className="text-xl mb-8">Compassionate care and advanced medicine for you and your family</p>
            <div className="flex flex-col justify-center sm:flex-row gap-4">
              <a href="#appointment" className="bg-white text-green-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition duration-300 text-center">
                Book Appointment
              </a>
              <a href="#services" className="border-2 border-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-green-900 transition duration-300 text-center">
                Our Services
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://img.freepik.com/free-vector/medical-team-concept-illustration_114360-1001.jpg" 
              alt="Medical team" 
              className="w-full max-w-md rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Emergency Info Bar */}
      <section className="bg-red-600 text-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <FaAmbulance className="text-2xl mr-3" />
            <div>
              <h3 className="font-bold">Emergency Line</h3>
              <p className="text-xl">+977 9827732069</p>
            </div>
          </div>
          <div className="flex items-center mb-3 md:mb-0">
            <FaClock className="text-2xl mr-3" />
            <div>
              <h3 className="font-bold">Working Hours</h3>
              <p>Mon-Sun: 24/7</p>
            </div>
          </div>
          <a 
            href="#contact" 
            className="bg-white text-red-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition duration-300 flex items-center"
          >
            <FaPhoneAlt className="mr-2" /> Contact Us
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer a wide range of medical services to meet all your healthcare needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Doctors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Specialist Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Meet our team of experienced healthcare professionals</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <img src={doctor.image} alt={doctor.name} className="w-full h-64 object-cover" />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-green-600 mb-4">{doctor.specialty}</p>
                  <a 
                    href="#appointment" 
                    className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition duration-300"
                  >
                    Book Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Patient Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">What our patients say about us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The care I received was exceptional. The doctors were knowledgeable and took time to explain everything to me."
                </p>
                <div className="flex items-center">
                  <img 
                    src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item}0.jpg`} 
                    alt="Patient" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">Patient Name</h4>
                    <p className="text-gray-500 text-sm">Cardiology Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;