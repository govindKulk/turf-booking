
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">TurfZone</h3>
            <p className="text-gray-500 text-sm">Your ultimate destination for booking sports turfs. Quick, easy, and reliable.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/turfs" className="text-gray-500 hover:text-primary text-sm">Find a Turf</Link></li>
              <li><Link to="/my-bookings" className="text-gray-500 hover:text-primary text-sm">My Bookings</Link></li>
              <li><Link to="/profile" className="text-gray-500 hover:text-primary text-sm">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm">FAQ</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-primary text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><Instagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} TurfZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
