"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Play, Star, Users, Trophy, Zap, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react';
import Link from 'next/link';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "High-Intensity Training",
      description: "Push your limits with our scientifically designed HIIT programs"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Coaching",
      description: "One-on-one guidance from certified fitness professionals"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Results Guaranteed",
      description: "Track your progress and achieve your fitness goals faster"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Executive",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "SweatLab transformed my fitness journey. The trainers are incredible and the community is so supportive!"
    },
    {
      name: "Mike Rodriguez",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Best gym investment I've ever made. Lost 30 pounds and gained so much confidence!"
    },
    {
      name: "Emma Thompson",
      role: "Teacher",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The variety of classes keeps me motivated. SweatLab makes fitness fun and addictive!"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                SweatLab
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
              <a href="#features" className="hover:text-red-500 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-red-500 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-red-500 transition-colors">Contact</a>
              <Link href="/auth" className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all transform hover:scale-105">
                Join Now
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 hover:text-red-500">Home</a>
              <a href="#features" className="block px-3 py-2 hover:text-red-500">Features</a>
              <a href="#testimonials" className="block px-3 py-2 hover:text-red-500">Reviews</a>
              <a href="#contact" className="block px-3 py-2 hover:text-red-500">Contact</a>
              <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full font-semibold">
                Join Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop" 
            alt="Gym background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-20 text-center max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent block">
              Body & Mind
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to SweatLab - where science meets sweat. Our cutting-edge facilities and expert trainers will help you achieve results you never thought possible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth" className="group bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-red-500/25 transition-all transform hover:scale-105 flex items-center">
              Start Your Journey
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group flex items-center px-8 py-4 border-2 border-white/20 rounded-full font-semibold hover:border-red-500 hover:bg-red-500/10 transition-all">
              <Play className="mr-2 w-5 h-5" />
              Watch Our Story
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">500+</div>
              <div className="text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">15+</div>
              <div className="text-gray-400">Trainers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">24/7</div>
              <div className="text-gray-400">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> SweatLab</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge technology with proven training methods to deliver unmatched results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Stories</span>
            </h2>
            <p className="text-xl text-gray-400">Hear from our incredible community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of members who have already transformed their lives at SweatLab
          </p>
          <Link href="/dashboard" className="group bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-105 flex items-center mx-auto">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  SweatLab
                </span>
              </div>
              <p className="text-gray-400">
                Transform your body and mind with science-backed fitness programs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition-colors">Strength Training</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">HIIT Classes</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Personal Training</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Nutrition Coaching</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SweatLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;