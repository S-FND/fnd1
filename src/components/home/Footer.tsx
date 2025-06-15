
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white">F</span>
              </div>
              <span>Fandoro</span>
            </div>
            <p className="text-muted-foreground">
              Empowering enterprises to monitor, manage and improve their sustainability metrics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>ESG Management</li>
                <li>GHG Accounting</li>
                <li>Compliance</li>
                <li>Reporting</li>
                <li>LMS</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Webinars</li>
                <li>Case Studies</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Fandoro. All rights reserved.</div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-foreground">Terms</Link>
            <Link to="#" className="hover:text-foreground">Privacy</Link>
            <Link to="#" className="hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
