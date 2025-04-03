import { FaInstagram, FaGlobe, FaTwitter, FaYoutube } from "react-icons/fa";
  
  export default function Footer() {
    return (
      <footer className="bg-footer text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
          {/* Left: copyright + icons */}
          <div className="space-y-4">
            <div>
              <p>Copyright © 2025 Tsoomo</p>
              <p>All rights reserved</p>
            </div>
            <div className="flex space-x-4 text-xl text-white/70">
              <FaInstagram className="hover:text-white transition" />
              <FaGlobe className="hover:text-white transition" />
              <FaTwitter className="hover:text-white transition" />
              <FaYoutube className="hover:text-white transition" />
            </div>
          </div>
  
          {/* Right-aligned container for middle + right */}
          <div className="flex flex-col md:flex-row md:ml-auto gap-24">
            {/* Middle: nav links */}
            <div className="space-y-3">
              <p>Бидний тухай</p>
              <p>Тусламж</p>
              <p>Үйлчилгээний нөхцөл</p>
              <p>Багцийн мэдээлэл</p>
            </div>
  
            {/* Right: contact */}
            <div className="space-y-3">
              <p className="font-semibold">Холбоо барих</p>
              <p>reginvite@gmail.com</p>
              <p>99180293</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  