import React from 'react';

const ForgotPassword: React.FC = () => {
  const forgotPassword = async () => {
    const res = await fetch('http://localhost:3001/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'brian.doe@example.com',
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={forgotPassword}>Forgot Password</button>
    </div>
  );
};

export default ForgotPassword;
