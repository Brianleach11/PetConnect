import React from 'react';

const Register: React.FC = () => {
  const registerUser = async () => {
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password',
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default Register;
