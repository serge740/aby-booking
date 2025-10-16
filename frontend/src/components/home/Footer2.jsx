import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";


export default function Footer() {
  return (
    <footer className="bg-[#0d0f14] text-white py-10 px-10 relative overflow-hidden">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-1/2">
          <h2 className="text-5xl font-bold text-white">
            Let’s Work <span className="text-yellow-400">Together</span>
          </h2>
          <div className="flex items-center mt-6">
            <img
              src="/logo.png"
              alt="Biogi Logo"
              className="h-12 w-12 mr-3"
            />
            <span className="text-2xl font-semibold">Biogi</span>
          </div>
          <p className="text-gray-400 mt-4 max-w-md">
            Neque vitae sit commodo posuere. Ut euismod nec magna senectus
            vestibulum libero. Nec risus pellentesque cursus in turpis. Nunc ac
            a ac et. Orci ante urna non et. Purus bibendum cras sem quam enim
            sem elit.
          </p>
          <nav className="flex space-x-6 mt-4">
            <a href="#" className="text-white hover:text-yellow-400">
              Home
            </a>
            <a href="#" className="text-white hover:text-yellow-400">
              Services
            </a>
            <a href="#" className="text-white hover:text-yellow-400">
              Contact
            </a>
          </nav>
        </div>

        <div className="relative">
          <div className="w-48 h-48 bg-red-400 text-white flex items-center justify-center rounded-full text-lg font-semibold uppercase absolute top-10 right-24 text-center">
            <span className="rotate-45">Get in Touch - Let’s Work</span>
          </div>
          <img
            src="/woman.png"
            alt="Woman"
            className="h-80 object-cover relative z-10"
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-600 mt-10 pt-6">
        <p className="text-gray-500 text-sm">
          &copy; 2024 Biogi - All Rights Reserved by The_Krishna
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <FaLinkedinIn size={20} />
          </a>
        </div>
        <a
          href="#"
          className="bg-yellow-400 p-3 rounded-full text-black hover:bg-yellow-500"
        >
          <IoIosArrowUp size={24} />
        </a>
      </div>
    </footer>
  );
}
