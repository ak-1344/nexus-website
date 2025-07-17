"use client"

import Link from "next/link"
import { Hexagon, Mail, Github, Linkedin, Twitter } from "lucide-react"

export function FooterRedesigned() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/#events" },
    { name: "Team", href: "/#team" },
    { name: "Gallery", href: "/gallery" },
    { name: "Highlights", href: "/#highlights" },
    { name: "Contact", href: "/contact" },
  ]

  const socialLinks = [
    { icon: <Mail className="h-5 w-5" />, href: "mailto:contact@nexusclub.edu", label: "Email" },
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/nexusclub", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/nexusclub", label: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/nexusclub", label: "Twitter" },
  ]

  return (
    <footer className="relative mt-20">
      <div className="backdrop-panel border-t border-primary/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Hexagon className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold gradient-text">Nexus Club</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering the next generation of tech innovators through collaboration, learning, and cutting-edge
                projects.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>contact@nexusclub.edu</p>
                <p>Computer Science Building, Room 301</p>
                <p>University Campus, City 12345</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Nexus Club | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
