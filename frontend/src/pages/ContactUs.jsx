import React, { useEffect } from "react";
import Header from "../components/header";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

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

    emailjs
      .sendForm(
        "service_kwzng64",
        "template_bz2mb97",
        form.current,
        "GbB192kAFStZjdFfT"
      )
      .then(
        (result) => {
          console.log("Success:", result.text);
          alert("Message sent successfully!");
          setFormData({
            from_name: "",
            user_email: "",
            subject: "",
            message: "",
          });
        },
        (error) => {
          console.log("Error:", error.text);
          alert("Failed to send message.");
        }
      )
      .finally(() => setLoading(false));
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      detail: "+250 791813289",
      link: "tel:+250791813289",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      detail: "info@abytechhub.com",
      link: "mailto:info@abytechhub.com",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      detail: " KN 3 Rd, Kigali",
      link: "https://share.google/zMIUGhrORT3Knc0xA",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      detail: "24/7 Available",
      link: null,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="w-full flex flex-col pb-16 items-center gap-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header title="Contact Us" path="contact us" />

      {/* Company Info Cards */}
      <div className="w-full px-4 lg:px-14 max-w-8xl mx-auto -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Icon Container */}
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {info.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith('http') ? "_blank" : undefined}
                    rel={info.link.startsWith('http') ? "noopener noreferrer" : undefined}
                    className="text-gray-900 font-bold text-lg hover:text-primary-600 transition-colors duration-200 block"
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
              <div className={`absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-br ${info.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Form & Map Section */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-12 w-full px-4 lg:px-14 max-w-8xl mx-auto">
        {/* Google Map */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white relative group">
            {/* Map Overlay Label */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-gray-900">Our Location</span>
              </div>
            </div>
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2922.2939038340305!2d-85.6696030232607!3d42.90884217114711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8819b394c0d8cd01%3A0x24e9c42fcca37dc!2sAbyRide%20taxi%20service!5e0!3m2!1sen!2srw!4v1740779811412!5m2!1sen!2srw"
              className="w-full border-0 aspect-[16/9] lg:aspect-square"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="relative bg-white p-8 lg:p-10 rounded-2xl shadow-xl border border-gray-100">
            {/* Decorative gradient blob */}
            <div className="absolute -top-2 -right-2 w-32 h-32 bg-gradient-to-br from-purple-900 to-blue-900 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-2 -left-2 w-32 h-32 bg-gradient-to-br from-purple-900 to-blue-900 opacity-10 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Get in Touch
                </h2>
              </div>
              <p className="text-gray-600 mb-6">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

              <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-5">
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white transition duration-200"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white transition duration-200"
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
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white transition duration-200 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-3.5 mt-2 bg-gradient-to-r from-purple-900 to-blue-900 text-white font-bold text-lg rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
    </div>
  );
};

export default ContactUs;