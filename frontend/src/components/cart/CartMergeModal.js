import React from 'react';

const CartMergeModal = ({ savedCount, guestCount, onChoice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Cart Conflict Detected</h3>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 mb-3">You have items in both carts:</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Previous cart:</span>
              <span className="font-bold text-blue-600">{savedCount} items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current cart:</span>
              <span className="font-bold text-blue-600">{guestCount} items</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">What would you like to do?</p>

        <div className="space-y-3">
          <button
            onClick={() => onChoice('merge')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg font-medium"
          >
            Merge Both Carts
          </button>
          
          <button
            onClick={() => onChoice('current')}
            className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Keep Current Cart Only
          </button>
          
          <button
            onClick={() => onChoice('previous')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Keep Previous Cart Only
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CartMergeModal;
