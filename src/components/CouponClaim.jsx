import React, { useState } from 'react';
import axios from 'axios';

function CouponClaim() {
  const [coupon, setCoupon] = useState('');
  const [message, setMessage] = useState('');

  const claimCoupon = async () => {
    try {
      const ip = await axios
        .get('https://api.ipify.org?format=json')
        .then((res) => res.data.ip);

      const res = await axios.post('http://localhost:5000/claim', {
        ip,
      });
      console.log(res);
      setCoupon(res.data.coupon);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-lg p-8 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Claim Your Coupon
        </h1>
        <div className='text-center'>
          <button
            onClick={claimCoupon}
            className='w-full cursor-pointer py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300'
          >
            Claim Coupon
          </button>
        </div>
        {message && (
          <p
            className={`mt-4 text-center p-3 rounded-md ${
              message.includes('error')
                ? 'bg-red-200 text-red-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {message}
          </p>
        )}
        {coupon && (
          <p className='mt-4 text-center text-xl font-semibold text-gray-800'>
            Your Coupon: <span className='text-blue-500'>{coupon}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default CouponClaim;
