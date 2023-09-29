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
    <div>
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
};

export default OwnerPetCardList;
