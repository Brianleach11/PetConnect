'use client'


// PetCardsList.tsx

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import PetCard from './PetCard';
import { PostgrestError } from '@supabase/supabase-js';  // Import PostgrestError

const PetCardsList: React.FC = () => {
  const [pets, setPets] = useState<Database['public']['Tables']['pet']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);  
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchPets = async () => {
      const response = await supabase.auth.getSession();

      // If there's a session and a user attached to it, get the userId
      const currentUserId = response.data.session?.user.id;

      if (currentUserId) {
        const { data, error } = await supabase.from('pet').select('*').neq('owner_id', currentUserId);
        if (error) {
          console.error('Error fetching pets:', error);
          setError(error);  // This line should now work without TypeScript issues
          setLoading(false);
          return;
        }      
        setPets(data || []);
        setLoading(false);
      }
    };

    fetchPets();
  }, [supabase]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading pets. Please try again later.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen"> {/* Added Flex and Centering utilities here */}
      <div className="petCardsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
        {pets.map(pet => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetCardsList;
