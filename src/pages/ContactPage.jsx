import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { hospitalInfo } from '../data/dummyData';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="text-primary-600" size={24} />,
      title: 'Phone',
      details: [
        { label: 'Main Line', value: hospitalInfo.phone },
        { label: 'Emergency', value: '+977 9811727803' },
        { label: 'Appointments', value: '+977 9863692789' }
      ]
    },
    {
      icon: <Mail className="text-primary-600" size={24} />,
      title: 'Email',
      details: [
        { label: 'General Inquiries', value: hospitalInfo.email },
        { label: 'Patient Services', value: 'patients@medicare-hospital.com' },
        { label: 'Medical Records', value: 'records@medicare-hospital.com' }
      ]
    },
    {
      icon: <MapPin className="text-primary-600" size={24} />,
      title: 'Address',
      details: [
        { label: 'Location', value: hospitalInfo.address }
      ]
    },
    {
      icon: <Clock className="text-primary-600" size={24} />,
      title: 'Hours',
      details: [
        { label: 'Emergency', value: '24/7' },
        { label: 'OPD', value: '8:00 AM - 8:00 PM' },
        { label: 'Visiting', value: '10:00 AM - 12:00 PM, 4:00 PM - 6:00 PM' }
      ]
    }
  ];

  const departments = [
    { name: 'Emergency Department', phone: '+977 9827732069', ext: '911' },
    { name: 'Cardiology', phone: '+977 9863692709', ext: '200' },
    { name: 'Neurology', phone: '+977 9863692709', ext: '300' },
    { name: 'Pediatrics', phone: '+977 9863692709', ext: '400' },
    { name: 'Orthopedics', phone: '+977 9863692709', ext: '500' },
    { name: 'Patient Services', phone: '+977 9811727803', ext: '100' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're here to help you with any questions, concerns, or assistance you may need. 
              Reach out to us through any of the following channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <div key={idx}>
                      <div className="text-sm font-medium text-gray-700">{detail.label}</div>
                      <div className="text-gray-600">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-green-800">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Appointment Inquiry</option>
                      <option value="medical">Medical Question</option>
                      <option value="billing">Billing Inquiry</option>
                      <option value="complaint">Complaint</option>
                      <option value="compliment">Compliment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="input"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary py-3 disabled:opacity-50"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2" size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
                <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center mb-6">
                  <div className="text-center text-gray-600">
                    <MapPin size={48} className="mx-auto mb-4" />
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">Hospital Location & Directions</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Address:</strong> {hospitalInfo.address}</p>
                  <p><strong>Parking:</strong> Free parking available on-site</p>
                  <p><strong>Public Transport:</strong> Bus routes 45, 67, and 89</p>
                </div>
              </div>

              {/* Department Contacts */}
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Contacts</h2>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{dept.name}</div>
                        <div className="text-sm text-gray-600">Extension {dept.ext}</div>
                      </div>
                      <div className="text-sm text-primary-600 font-medium">
                        {dept.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-12 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <div className="text-4xl font-bold">🚨</div>
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              Medical Emergency?
            </h2>
            <p className="text-lg text-red-800 mb-6">
              If you're experiencing a medical emergency, don't wait. 
              Call 911 or come directly to our Emergency Department.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:911"
                className="btn bg-red-600 text-white hover:bg-red-700 text-lg px-8 py-3"
              >
                Call 911
              </a>
              <a
                href={`tel:${hospitalInfo.phone}`}
                className="btn bg-red-100 text-red-700 hover:bg-red-200 text-lg px-8 py-3"
              >
                Call Hospital: {hospitalInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;