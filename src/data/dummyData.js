// Dummy data for the Hospital Management System

export const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    experience: 12,
    rating: 4.8,
    reviews: 156,
    email: 'sarah.johnson@hospital.com',
    phone: '+1234567890',
    image: 'https://images.pexels.com/photos/559827/pexels-photo-559827.jpeg?auto=compress&cs=tinysrgb&w=300',
    qualifications: 'MD, PhD in Cardiology',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    description: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    experience: 8,
    rating: 4.9,
    reviews: 203,
    email: 'michael.chen@hospital.com',
    phone: '+1234567891',
    image: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg?auto=compress&cs=tinysrgb&w=300',
    qualifications: 'MD, Neurology Specialist',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    description: 'Expert neurologist with focus on brain and nervous system disorders.',
    timeSlots: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00']
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    experience: 15,
    rating: 4.7,
    reviews: 189,
    email: 'emily.rodriguez@hospital.com',
    phone: '+1234567892',
    image: 'https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg?auto=compress&cs=tinysrgb&w=300',
    qualifications: 'MD, Board Certified Pediatrician',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    description: 'Dedicated pediatrician providing comprehensive care for children and adolescents.',
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
  },
  {
    id: 4,
    name: 'Dr. Robert Wilson',
    specialization: 'Orthopedics',
    experience: 20,
    rating: 4.6,
    reviews: 145,
    email: 'robert.wilson@hospital.com',
    phone: '+1234567893',
    image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=300',
    qualifications: 'MD, Orthopedic Surgery Specialist',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    description: 'Experienced orthopedic surgeon specializing in joint replacement and sports injuries.',
    timeSlots: ['08:00', '09:00', '10:00', '13:00', '14:00']
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialization: 'Dermatology',
    experience: 10,
    rating: 4.9,
    reviews: 167,
    email: 'lisa.thompson@hospital.com',
    phone: '+1234567894',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
    qualifications: 'MD, Dermatology Board Certified',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    description: 'Board-certified dermatologist providing medical and cosmetic skin care services.',
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  }
];

export const patients = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567895',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, City, State 12345',
    emergencyContact: 'Jane Smith - +1234567896'
  }
];

export const appointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    date: '2024-12-25',
    time: '10:00',
    reason: 'Regular checkup',
    status: 'confirmed',
    createdAt: '2024-12-20'
  },
  {
    id: 2,
    patientId: 1,
    doctorId: 2,
    date: '2024-12-28',
    time: '14:00',
    reason: 'Headache consultation',
    status: 'pending',
    createdAt: '2024-12-20'
  }
];

export const prescriptions = [
  {
    id: 1,
    appointmentId: 1,
    patientId: 1,
    doctorId: 1,
    medicines: [
      {
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food'
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take before meals'
      }
    ],
    notes: 'Continue current exercise routine. Schedule follow-up in 3 months.',
    createdAt: '2024-12-20'
  }
];

export const chatMessages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 1,
    senderType: 'patient',
    message: 'Hello Dr. Johnson, I have some questions about my medication.',
    timestamp: '2024-12-20T10:00:00Z',
    read: true
  },
  {
    id: 2,
    senderId: 1,
    receiverId: 1,
    senderType: 'doctor',
    message: 'Hello John! I\'d be happy to help. What questions do you have?',
    timestamp: '2024-12-20T10:05:00Z',
    read: true
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 1,
    senderType: 'patient',
    message: 'Should I take the aspirin with or without food?',
    timestamp: '2024-12-20T10:10:00Z',
    read: false
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Maria Garcia',
    comment: 'Excellent care and professional staff. Dr. Johnson was very thorough and caring.',
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 2,
    name: 'David Lee',
    comment: 'The appointment booking system is so convenient. Great experience overall.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    comment: 'Professional healthcare with a personal touch. Highly recommend this hospital.',
    rating: 5,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const services = [
  {
    id: 1,
    title: 'Emergency Care',
    description: '24/7 emergency medical services with state-of-the-art facilities.',
    icon: '🚑'
  },
  {
    id: 2,
    title: 'Cardiology',
    description: 'Comprehensive heart care including diagnostics and treatment.',
    icon: '❤️'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Specialized medical care for infants, children, and adolescents.',
    icon: '👶'
  },
  {
    id: 4,
    title: 'Orthopedics',
    description: 'Expert treatment for bone, joint, and muscle conditions.',
    icon: '🦴'
  },
  {
    id: 5,
    title: 'Neurology',
    description: 'Advanced care for brain and nervous system disorders.',
    icon: '🧠'
  },
  {
    id: 6,
    title: 'Dermatology',
    description: 'Complete skin care services for medical and cosmetic needs.',
    icon: '🩺'
  }
];

export const hospitalInfo = {
  name: 'NepoHeal Hospital',
  tagline: 'Your Health, Our Priority',
  mission: 'To provide exceptional healthcare services with compassion, innovation, and excellence.',
  address: 'Putalisadak Kathmandu Nepal',
  phone: '+977 9827732069',
  email: 'asur0825om@gmail.com',
  founded: '1985',
  beds: 250,
  staff: 450,
  departments: 15
};