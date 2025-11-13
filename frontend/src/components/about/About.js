import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About GadgetBazar</h1>
          <p className="text-xl text-gray-600">Your trusted destination for quality gadgets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              GadgetBazar was founded with a simple mission: to make quality gadgets accessible to everyone. 
              We believe technology should enhance lives, and we're committed to bringing you the latest and 
              greatest products at competitive prices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide customers with authentic, high-quality gadgets and exceptional service. We strive to 
              create a seamless shopping experience from browsing to delivery, ensuring customer satisfaction 
              at every step.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold mb-2">100% Authentic</h3>
              <p className="text-gray-600">All products are genuine and sourced from authorized distributors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery across Bangladesh</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Multiple payment options with secure checkout</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Email:</strong> support@gadgetbazar.com</p>
            <p><strong>Phone:</strong> +880 1234-567890</p>
            <p><strong>Address:</strong> Dhaka, Bangladesh</p>
            <p><strong>Business Hours:</strong> 9:00 AM - 9:00 PM (7 days a week)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
