import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6">Your payment could not be processed. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
