import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Coffee } from "lucide-react";
import Header from "../components/header";
import backgroundImage from "../assets/coffee4.jpg";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    user_email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);

  const form = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulating email send - replace with your actual emailjs implementation
    setTimeout(() => {
      alert("Message sent successfully!");
      setFormData({
        from_name: "",
        user_email: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      detail: "+250 791 813 289",
      link: "tel:+250791813289",
      color: "from-primary-600 to-primary-700"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      detail: "hello@jambokawa.com",
      link: "mailto:hello@jambokawa.com",
      color: "from-primary-600 to-primary-700"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      detail: "kigali, Rwanda",
      link: "https://maps.google.com",
      color: "from-primary-600 to-primary-700"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      detail: "Mon-Sun: 7AM - 10PM",
      link: null,
      color: "from-primary-600 to-primary-700"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center ">
      {/* Header */}
      <Header title={"Contact Us"} path={"contact"} />
      <div
        className=" w-full bg-white flex flex-col items-center gap-12 pt-12 "
       
      >
        {/* Company Info Cards */}
        <div className="w-full px-4 lg:px-14 mx-auto -mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative bg-white/90 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary-500"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Icon Container */}
                <div
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{info.icon}</div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wide mb-1">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={
                        info.link.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        info.link.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-gray-900 font-bold text-lg hover:text-primary-500 transition-colors duration-200 block"
                    >
                      {info.detail}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-bold text-lg">
                      {info.detail}
                    </p>
                  )}
                </div>

                {/* Decorative Element */}
                <div
                  className={`absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-br ${info.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div 
         style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
        }}
        className="flex flex-col py-20 w-full gap-8 ">


        {/* Form & Map Section */}
        <div  className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-12 w-full px-4 lg:px-14 mx-auto ">
          {/* Google Map */}
          <div className="w-full lg:w-1/2 flex bg-white items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
              {/* Map Overlay Label */}
              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold text-gray-900">
                    Visit Our Cafe
                  </span>
                </div>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2176709267986!2d-73.98823492346677!3d40.75797883540513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1709123456789!5m2!1sen!2sus"
                className="w-full border-0 aspect-[16/9] lg:aspect-square h-[750px] "
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full h-[755px] lg:w-1/2 flex flex-col justify-center  ">
            <div className="relative bg-white/90  lg:p-12 rounded-2xl shadow-xl border border-primary-500 h-full ">
              {/* Decorative gradient blobs */}
              <div className="absolute -top-2 -right-2 w-32 h-32 bg-gradient-to-br from-primary-500 to-[#a38e6a] opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-primary-500 to-[#a38e6a] opacity-10 rounded-full blur-3xl"></div>

              <div className="relative h-full ">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-[#a38e6a] flex items-center justify-center shadow-lg">
                    <Coffee className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Get in Touch
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Have a question or special request? We'd love to hear from
                  you. Send us a message!
                </p>

                <form
                  ref={form}
                  onSubmit={sendEmail}
                  className="flex flex-col gap-5 h-full "
                >
                  {/* Name Field */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary-500 bg-primary-500/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a38e6a] focus:bg-white transition duration-200"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="user_email"
                      value={formData.user_email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary-500 bg-primary-500/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a38e6a] focus:bg-white transition duration-200"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your coffee preferences or any questions..."
                      required
                      rows="5"
                      className="w-full px-4 py-3 rounded-xl border-2 border-primary-500 bg-primary-500/10 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a38e6a] focus:bg-white transition duration-200 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-3.5 mt-2 bg-gradient-to-r from-primary-500 to-[#a38e6a] text-white font-bold text-lg rounded-xl hover:from-[#a38e6a] hover:to-[#8c7452] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          Send Message
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Coffee-themed Section */}
        <div className="w-full px-4 lg:px-14 mx-auto">
          <div className="bg-gradient-to-r from-primary-500 to-[#a38e6a] rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>

            <div className="relative text-center max-w-3xl mx-auto">
              <Coffee className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Visit Us for a Perfect Cup
              </h3>
              <p className="text-xl text-[#f2e0bf] mb-6">
                Whether you're a coffee connoisseur or just looking for a cozy
                spot to relax, we're here to serve you the finest brews in town.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="font-semibold">Free WiFi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="font-semibold">Cozy Atmosphere</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="font-semibold">Premium Beans</p>
                </div>
              </div>
            </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
