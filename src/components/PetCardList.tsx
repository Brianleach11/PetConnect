'use client'

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import PetCard from './PetCard';
import { PostgrestError } from '@supabase/supabase-js';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal } from 'lucide-react';

const PetCardsList: React.FC = () => {
  const [pets, setPets] = useState<Database['public']['Tables']['pet']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [lookingFor, setLookingFor] = useState('Default');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [petType, setPetType] = useState('');
  const statesList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  const supabase = createClientComponentClient<Database>();

  const checkFriendship = async (owner_id: string) => {
    const response = await supabase.auth.getSession();
    const currentUserId = response.data.session?.user.id;

    if (!owner_id || !currentUserId) {
      console.error("Invalid IDs for checking friendship status");
      return false;
    }

    const { data: sentFriendship } = await supabase
      .from('friends')
      .select('*')
      .eq('sending_user', currentUserId)
      .eq('receiving_user', owner_id);

    if (sentFriendship && sentFriendship.length > 0) {
      return true;
    }

    const { data: receivedFriendship } = await supabase
      .from('friends')
      .select('*')
      .eq('sending_user', owner_id)
      .eq('receiving_user', currentUserId);

    return receivedFriendship && receivedFriendship.length > 0;
  };

  const updateFilterPreferences = async () => {
    const response = await supabase.auth.getSession();
    const currentUserId = response.data.session?.user.id;
    if (!currentUserId) {
      console.error("No current user ID found");
      return;
    }

    const { error } = await supabase
      .from('user')
      .update({ looking_for: lookingFor, filter_city: city, filter_state: selectedState })
      .eq('id', currentUserId);

    if (error) {
      console.error("Error updating user preferences", error);
      return;
    }

    fetchPets();
  };

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await supabase.auth.getSession();
      const currentUserId = response.data.session?.user.id;
      if (!currentUserId) throw new Error("User not found");
  
      // Fetch all pets excluding the current user's pets
      const { data: petsData, error: petsError } = await supabase
        .from('pet')
        .select('*')
        .neq('owner_id', currentUserId);
  
      if (petsError) throw petsError;
  
      // Fetch user's filter preferences
      const { data: userFilterPreferences, error: userError } = await supabase
        .from('user')
        .select('looking_for, filter_city, filter_state')
        .eq('id', currentUserId)
        .single();
  
      if (userError) throw userError;
  
      // Filter pets based on the owner's preferences
      const filteredPets = [];
      for (const pet of petsData) {
        // Ensure owner_id is not null before proceeding
        if (pet.owner_id) {
          const ownerPreferences = await supabase
            .from('user')
            .select('looking_for, filter_city, filter_state')
            .eq('id', pet.owner_id) // pet.owner_id is guaranteed to be a string here
            .single();
  
        if (ownerPreferences.data) {
          const matchLookingFor = userFilterPreferences.looking_for === 'Default' || ownerPreferences.data.looking_for === userFilterPreferences.looking_for;
          const matchCity = !userFilterPreferences.filter_city || userFilterPreferences.filter_city === 'Any' || ownerPreferences.data.filter_city === userFilterPreferences.filter_city;
          const matchState = !userFilterPreferences.filter_state || userFilterPreferences.filter_state === 'Any' || ownerPreferences.data.filter_state === userFilterPreferences.filter_state;
          const isFriend = await checkFriendship(pet.owner_id);

          if (!isFriend && matchLookingFor && matchCity && matchState) {
            filteredPets.push(pet);
          }
        }
      }
    }
  
      setPets(filteredPets);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(err as PostgrestError);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPets();
  }, []);

  const errorMessage = error ? <p>Error loading pets. Please try again later.</p> : null;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
    <div>
        <button 
          onClick={() => setFilterOpen(true)} 
          className="flex items-center justify-center p-2 bg-lightblue text-white rounded hover:bg-midnight"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="">Filter</span>
        </button>
      </div>
    
      <Dialog.Root open={filterOpen} onOpenChange={setFilterOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-30" />
        <Dialog.Content className="fixed top-[120px] left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg w-1/3 z-40">
          <Dialog.Title className="text-lg font-semibold mb-4">Filter Options</Dialog.Title>
            <select value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} className="mb-4 w-full p-2 border rounded">
            <option value="Default">Any</option>
            <option value="Playdates">Playdates</option>
            <option value="Breeding">Breeding</option>
            <option value="General Information">General Information</option>
          </select>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="mb-4 w-full p-2 border rounded">
            <option value="">Any</option>
            {statesList.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="City" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            className="mb-4 w-full p-2 border rounded"
          />
          <button onClick={updateFilterPreferences} className="w-full p-2 bg-softGreen text-black rounded hover:bg-gray">
            Apply Filters
          </button>
        </Dialog.Content>
      </Dialog.Root>
  
      {errorMessage}
  
      {pets.length === 0 && !loading && (
      <div className="text-center mt-10">
      <img src="/sad-pet.jpg" alt="Sad Pet" className="mx-auto" style={{ maxWidth: '300px' }} />
        <p className="text-lg mt-4">Sorry, there are no pets found :( </p>
      </div>
    )}

    <div className={`petCardsList grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  mt-8  ${pets.length === 0 ? 'hidden' : ''}`}>
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  </div>
);
  
  
};

export default PetCardsList;
