import React from 'react';
import { Award, Users, Heart, Shield, Clock, MapPin } from 'lucide-react';
import { hospitalInfo } from '../data/dummyData';

const AboutPage = () => {
  const milestones = [
    { year: '1985', event: 'Hospital founded with 50 beds' },
    { year: '1995', event: 'Expanded to 150 beds and added ICU' },
    { year: '2005', event: 'Launched specialized cardiac center' },
    { year: '2015', event: 'Introduced robotic surgery capabilities' },
    { year: '2020', event: 'Implemented telemedicine services' },
    { year: '2024', event: 'Reached 250 beds and 15 departments' }
  ];

  const values = [
    {
      icon: <Heart className="text-red-500" size={32} />,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and dignity, ensuring comfort during their healing journey.'
    },
    {
      icon: <Award className="text-yellow-500" size={32} />,
      title: 'Excellence',
      description: 'We strive for the highest standards in medical care, continuously improving our services and outcomes.'
    },
    {
      icon: <Shield className="text-blue-500" size={32} />,
      title: 'Safety First',
      description: 'Patient safety is our top priority. We maintain rigorous safety protocols and quality standards.'
    },
    {
      icon: <Users className="text-green-500" size={32} />,
      title: 'Teamwork',
      description: 'Our multidisciplinary approach ensures collaborative care for the best possible patient outcomes.'
    }
  ];

  const leadership = [
    {
      name: 'Dr. Elizabeth Harper',
      position: 'Chief Executive Officer',
      image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: '25+ years in healthcare administration and clinical practice.'
    },
    {
      name: 'Dr. Michael Rodriguez',
      position: 'Chief Medical Officer',
      image: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Board-certified surgeon with expertise in minimally invasive procedures.'
    },
    {
      name: 'Sarah Thompson, RN',
      position: 'Chief Nursing Officer',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Dedicated to nursing excellence and patient care innovation.'
    },
    {
      name: 'Dr. James Wilson',
      position: 'Director of Medical Services',
      image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Leading our medical departments with focus on quality and collaboration.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              About {hospitalInfo.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              For nearly four decades, we have been committed to providing exceptional healthcare 
              services to our community. Our mission is simple: to deliver compassionate, 
              high-quality medical care that puts patients first.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hospital interior"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {hospitalInfo.mission} We combine advanced medical technology with 
                  human compassion to create a healing environment where patients and 
                  their families feel supported, informed, and cared for.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To be the leading healthcare provider in our region, recognized for 
                  medical excellence, innovative treatments, and exceptional patient experience. 
                  We envision a future where every patient receives personalized, world-class care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do and shape 
              the way we deliver healthcare to our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to becoming a leading healthcare institution, 
              here are the key milestones in our growth and development.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {milestone.year}
                      </div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced leadership team brings together decades of healthcare 
              expertise to guide our mission of providing exceptional patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {leader.position}
                  </p>
                  <p className="text-sm text-gray-600">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our achievements and statistics reflect our commitment to 
              providing quality healthcare to our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {hospitalInfo.beds}+
              </div>
              <div className="text-lg font-medium text-gray-900 mb-1">Hospital Beds</div>
              <div className="text-sm text-gray-600">Modern, comfortable patient rooms</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {hospitalInfo.staff}+
              </div>
              <div className="text-lg font-medium text-gray-900 mb-1">Healthcare Professionals</div>
              <div className="text-sm text-gray-600">Dedicated doctors, nurses, and staff</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {hospitalInfo.departments}+
              </div>
              <div className="text-lg font-medium text-gray-900 mb-1">Medical Departments</div>
              <div className="text-sm text-gray-600">Comprehensive healthcare services</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-lg font-medium text-gray-900 mb-1">Emergency Care</div>
              <div className="text-sm text-gray-600">Round-the-clock medical attention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Address</div>
                    <div className="text-gray-600">{hospitalInfo.address}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-medium text-gray-900">Hours</div>
                    <div className="text-gray-600">
                      <div>Emergency: 24/7</div>
                      <div>OPD: 8:00 AM - 8:00 PM</div>
                      <div>Visiting Hours: 10:00 AM - 12:00 PM, 4:00 PM - 6:00 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin size={48} className="mx-auto mb-4" />
                <p>Interactive Map Would Go Here</p>
                <p className="text-sm">Hospital Location & Directions</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;