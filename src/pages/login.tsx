import React from 'react';

const Login: React.FC = () => {
  const loginUser = async () => {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'brian.doe@example.com',
        password: 'password',
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default Login;
