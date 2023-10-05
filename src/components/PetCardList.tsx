'use client'


// PetCardsList.tsx

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import PetCard from './PetCard';

const PetCardsList: React.FC = () => {
  const [pets, setPets] = useState<Database['public']['Tables']['pet']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchPets = async () => {
      const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (currentUserId) {
        const { data, error } = await supabase.from('pet').select('*').neq('owner_id',currentUserId,);
        if (error) {
          console.error('Error fetching pets:', error);
          setLoading(false);
          return;
        }
        setPets(data || []);
        setLoading(false);
      }
    };

    fetchPets();
  }, );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading pets. Please try again later.</p>;

  return (
    <div className="petCardsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6"> 
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} />  
      ))}
    </div>
   );
};

export default PetCardsList;
