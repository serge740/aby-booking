import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Eye, EyeOff, Users, Building2, Shield, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAdminAuth from '../../../context/AdminAuthContext';
import Logo from '../../../assets/trans.png';

const AdminLogin = () => {
  const { login, loginWithGoogle, isLoading: authLoading, isAuthenticated } = useAdminAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from);
    }
  }, [isAuthenticated, authLoading, location, navigate]);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (touched[name] || value !== '') {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await login({
        adminEmail: formData.email,
        password: formData.password,
      });
      if (response.authenticated) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from);
      } else {
        setErrors({ general: response.message || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error.message || 'An error occurred during login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    try {
      loginWithGoogle(false);
    } catch (error) {
      setErrors({ general: 'Google login failed. Please try again.' });
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return !!formData.email && !!formData.password && !errors.email && !errors.password;
  };

  return (
    <div className=" flex bg-white">
      {/* Left side - Brand with Background Image */}
      <div 
        className="w-5/12 flex items-center justify-center p-8 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900"></div>
        
        {/* Animated circles */}
        <div className="absolute top-20 right-20 w-64 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-lg text-white relative z-10">
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl" data-aos="fade-up">
            <div className="mb-6">
              <Shield className="w-16 h-16 text-white mb-4" />
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Empowering People with <span className="text-[#d6e2f4]">Fine Fish</span>
            </h1>
            
            <div className="mb-8 flex justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              Simplify workforce management, empower growth, and foster harmony across your organization.
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1.5 bg-white/80 rounded-full"></div>
              <div className="w-8 h-1.5 bg-white/60 rounded-full"></div>
              <div className="w-4 h-1.5 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-7/12 flex flex-col justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#e7eff8] rounded-full blur-2xl opacity-50"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#d6e2f4] rounded-full blur-3xl opacity-40"></div>
        
        <div className="w-full max-w-xl mx-auto relative z-10" data-aos="zoom-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src={Logo} alt="Fine Fish Logo" className=" h-16" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your admin dashboard</p>
          </div>

          {/* Error message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <p className="text-red-700 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                      : 'border-gray-200 focus:border-[#0c62c3] focus:ring-4 focus:ring-[#e7eff8]'
                  } focus:outline-none`}
                  placeholder="Enter your email"
                  disabled={isLoading || authLoading}
                />
                {errors.email && touched.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3.5 pr-12 rounded-xl border-2 transition-all duration-200 ${
                      errors.password
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-gray-200 focus:border-[#0c62c3] focus:ring-4 focus:ring-[#e7eff8]'
                    } focus:outline-none`}
                    placeholder="Enter your password"
                    disabled={isLoading || authLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#0c62c3] transition-colors disabled:opacity-50"
                    disabled={isLoading || authLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password}
                  </p>
                )}
              </div>

            

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || authLoading || !isFormValid()}
                className="w-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white py-4 px-4 rounded-xl font-semibold hover:from-[#0a56ae] hover:to-[#0c62c3] focus:outline-none focus:ring-4 focus:ring-[#adc7e9] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading || authLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>
            </form>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || authLoading}
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 py-4 px-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-[#0c62c3] hover:text-[#0c62c3] focus:outline-none focus:ring-4 focus:ring-[#e7eff8] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading || authLoading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in with Google...
                </span>
              ) : (
                'Sign in with Google'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;