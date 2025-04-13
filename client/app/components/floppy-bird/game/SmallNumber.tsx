import React from 'react';

const SmallNumber = ({ number = 0 }) => {
  // Ensure number is a valid number
  const validNumber = typeof number === 'number' ? number : 0;
  const digits = validNumber.toString().split('');
  
  return (
    <div className="small-number">
      {digits.map((digit, index) => (
        <div key={index} className={`digit digit-${digit}`} />
      ))}
    </div>
  );
};

export default SmallNumber; 