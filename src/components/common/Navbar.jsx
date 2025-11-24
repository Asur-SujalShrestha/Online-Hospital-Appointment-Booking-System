import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaUserMd, FaInfoCircle, FaEnvelope, FaHospital, FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAsyncError, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  // Mock user state - replace with your actual authentication logic
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState("");
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        const id = payload.id || payload.userId;
        setUserId(id);

        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8083/nepoHeal/user/getUserById/${id}`);
            setUserName(response.data.firstName + " " + response.data.lastName);
          } catch (err) {
            console.error("Error fetching user:", err);
            toast.error("Could not fetch user details.");
          }
        };
        fetchUser();
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        toast.error("Authentication error. Please log in again.");
      }
    } else {
      setUserName(""); // clear username on logout
    }
  }, [authToken]);

  // Mock login/logout functions - replace with your actual auth logic
  const handleLogin = () => {
    navigate("/login");
    closeMenu();
  };
  const handleRegister = () => {
    navigate("/register")
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);  // 🔥 this will trigger useEffect to clear user
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-green-700 py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <FaHospital className={`text-3xl mr-2 ${scrolled ? 'text-green-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${scrolled ? 'text-green-800' : 'text-white'}`}>
              NepoHeal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/home" icon={<FaHome />} text="Home" scrolled={scrolled} />
            <NavLink href="/doctors" icon={<FaUserMd />} text="Doctors" scrolled={scrolled} />
            <NavLink href="/about" icon={<FaInfoCircle />} text="About Us" scrolled={scrolled} />
            <NavLink href="/contact" icon={<FaEnvelope />} text="Contact Us" scrolled={scrolled} />

            {userName ? (
              <div className="relative user-dropdown">
                <button
                  onClick={toggleUserDropdown}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md ${scrolled ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-green-800'}`}
                >
                  <FaUser className="mr-1" />
                  <span>{userName}</span>
                </button>

                {userDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${scrolled ? 'bg-white' : 'bg-green-900'} ring-1 ring-black ring-opacity-5`}>
                    <a
                      href="/profile-profile"
                      className={`block px-4 py-2 text-sm ${scrolled ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-green-800'}`}
                    >
                      My Profile
                    </a>
                    <a
                      href="#appointments"
                      className={`block px-4 py-2 text-sm ${scrolled ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-green-800'}`}
                    >
                      My Appointments
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${scrolled ? 'text-gray-700 hover:bg-green-50' : 'text-white hover:bg-green-800'}`}
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavButton
                  onClick={handleLogin}
                  icon={<FaSignInAlt />}
                  text="Login"
                  scrolled={scrolled}
                />
                <NavButton
                  onClick={handleRegister}
                  icon={<FaUserPlus />}
                  text="Register"
                  scrolled={scrolled}
                  isPrimary
                />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={`outline-none ${scrolled ? 'text-green-600' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 bg-green-900 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <MobileNavLink href="#home" icon={<FaHome />} text="Home" onClick={closeMenu} />
            <MobileNavLink href="#doctors" icon={<FaUserMd />} text="Doctors" onClick={closeMenu} />
            <MobileNavLink href="#about" icon={<FaInfoCircle />} text="About Us" onClick={closeMenu} />
            <MobileNavLink href="#contact" icon={<FaEnvelope />} text="Contact Us" onClick={closeMenu} />

            {isLoggedIn ? (
              <div className="flex flex-col items-center space-y-6 pt-4">
                <div className="flex items-center text-white text-xl">
                  <FaUser className="mr-3" />
                  <span>{userName}</span>
                </div>

                <MobileNavLink href="#profile" icon={<FaUser />} text="My Profile" onClick={closeMenu} />
                <MobileNavLink href="#appointments" icon={<FaUserMd />} text="My Appointments" onClick={closeMenu} />

                <button
                  onClick={handleLogout}
                  className="flex items-center text-white text-xl px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-4">
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center text-white text-xl px-6 py-3 hover:bg-green-800 rounded-md w-64 transition-colors"
                >
                  <FaSignInAlt className="mr-3" />
                  Login
                </button>

                <button
                  onClick={() => { }}
                  className="flex items-center justify-center text-white text-xl px-6 py-3 bg-green-700 hover:bg-green-600 rounded-md w-64 transition-colors"
                >
                  <FaUserPlus className="mr-3" />
                  Register
                </button>
              </div>
            )}
          </div>

          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </nav>
  );
};

// Component for desktop navigation links
const NavLink = ({ href, icon, text, scrolled }) => {
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled
          ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          : 'text-white hover:text-green-200'
        }`}
    >
      <span className="mr-2">{icon}</span>
      {text}
    </a>
  );
};

// Component for desktop navigation buttons
const NavButton = ({ onClick, icon, text, scrolled, isPrimary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isPrimary
          ? scrolled
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-white text-green-900 hover:bg-green-100'
          : scrolled
            ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
            : 'text-white hover:text-green-200'
        }`}
    >
      <span className="mr-2">{icon}</span>
      {text}
    </button>
  );
};

// Component for mobile navigation links
const MobileNavLink = ({ href, icon, text, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center text-white text-xl px-4 py-3 hover:bg-green-800 rounded-md w-64 justify-center transition-colors"
    >
      <span className="mr-3">{icon}</span>
      {text}
    </a>
  );
};

export default Navbar;