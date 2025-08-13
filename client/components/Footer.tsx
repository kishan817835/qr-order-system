import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SG</span>
              </div>
              <h3 className="text-xl font-bold">Spice Garden</h3>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Experience authentic Indian cuisine with the finest ingredients and traditional cooking methods.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 opacity-80" />
                <span>123 Main Street, Food District</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 opacity-80" />
                <span>+91 12345 67890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 opacity-80" />
                <span>info@spicegarden.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/menu/1" className="opacity-80 hover:opacity-100 transition">Menu</a></li>
              <li><a href="/menu/1?service=delivery" className="opacity-80 hover:opacity-100 transition">Order Online</a></li>
              <li><a href="/menu/1?service=takeaway" className="opacity-80 hover:opacity-100 transition">Takeaway</a></li>
              <li><a href="/admin" className="opacity-80 hover:opacity-100 transition">Admin Panel</a></li>
              <li><a href="/kitchen" className="opacity-80 hover:opacity-100 transition">Kitchen Dashboard</a></li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Opening Hours
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Mon - Thu:</span>
                <span>9:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Fri - Sat:</span>
                <span>9:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://wa.me/911234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green rounded-full flex items-center justify-center hover:bg-opacity-80 transition"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/spice-garden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-opacity-80 transition"
              >
                <span className="text-sm font-bold">in</span>
              </a>
              <a 
                href="https://facebook.com/spice-garden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-opacity-80 transition"
              >
                <span className="text-sm font-bold">f</span>
              </a>
              <a 
                href="https://instagram.com/spice-garden" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-opacity-80 transition"
              >
                <span className="text-sm font-bold">📷</span>
              </a>
            </div>
            <p className="text-sm opacity-80">
              Follow us for daily specials and updates!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="opacity-80">
            © {currentYear} Spice Garden. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="opacity-80 hover:opacity-100 transition">Privacy Policy</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition">Terms of Service</a>
            <a href="#" className="opacity-80 hover:opacity-100 transition">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
