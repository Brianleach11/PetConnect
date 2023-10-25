import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import PetCard from './PetCard';
import { PostgrestError } from '@supabase/supabase-js';

interface Props {
  userId: string;
}

const OwnerPetCardList: React.FC<Props> = ({ userId }) => {
  const [pets, setPets] = useState<Database['public']['Tables']['pet']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from('pet')
        .select('*')
        .eq('owner_id', userId);

      if (error) {
        console.error('Error fetching pets:', error);
        setError(error);
        setLoading(false);
        return;
      }

      setPets(data || []);
      setLoading(false);
    };

    if (userId) {
      fetchPets();
    } else {
      setLoading(false);
    }
  }, [supabase, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading pets. Please try again later.</p>;

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:max-w-screen">
        {pets.map(pet => (
          <div key={pet.id} className="overflow-hidden">
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default OwnerPetCardList;
