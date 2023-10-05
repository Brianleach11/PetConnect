import React from 'react';
import Link from 'next/link';
import UserProfileForm from '@/components/userProfileForm'; // Make sure to import UserProfileForm from the correct location

const UserProfilePage = () => {
  return (
    <div className="py-4 container bg-whiteGreen mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] border-2 border-midnight border-opacity-100 rounded-lg">
      <Link href="/" className="text-left hover:text-brand text-sm underline underline-offset-4">Home</Link>
      <div className="flex flex-col space-y-2 text-center">
        {/* Add your image import */}
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to your Profile</h1>
        <p className="text-sm max-w-xs mx-auto">
          Complete your profile to get the most out of the community!
        </p>
      </div>
      <UserProfileForm />
      
    </div>
  );
};

export default UserProfilePage;
