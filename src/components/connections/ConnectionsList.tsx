'use client'
import { FC, useState } from 'react';
import { Session, createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ConnectionPreview from './ConnectionPreview';
import { UserMinus2, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { Database } from '@/types/supabase';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface Connections {
  id: number;
  created_at: string;
  sending_user: string;
  receiving_user: string;
}
type NullableConnections = Connections[] | null;

interface ConnectionsListProps {
  session: Session;
  connections: NullableConnections;
}

const ConnectionsList: FC<ConnectionsListProps> = ({ session, connections }) => {
  let numConnections = connections?.length;
  if (!numConnections || numConnections === undefined) numConnections = 0;
  const [deleteConnections, setDeleteConnections] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>()
  const {toast} = useToast()
  const router = useRouter()

  const deleteConnection = async (index: number) => {
    if(connections && connections[index]){
        const {error} = await supabase
            .from('friends')
            .delete()
            .eq('sending_user', connections[index].sending_user)
            .eq('receiving_user', connections[index].receiving_user)

        router.refresh()

        if(error){
            toast({
                title: "Error",
                description: "There was an issue deleteing this connection",
                variant: 'destructive'
            })
            return
        }
        toast({
            title: "Success",
            description: "Connection successfully removed",
            variant: 'default'
        })
    }
  }

  return (
    <div className=' text-midnight relative'>
      <div className='flex justify-end pr-4'>
        <UserMinus2
          className={`items-right top-0 hover:bg-midnight rounded-sm hover:text-white`}
          onClick={() => {
            deleteConnections ? 
            setDeleteConnections(false) :
            setDeleteConnections(true)
          }}
        />
      </div>
      {numConnections === 0 ? (
        <div className='text-midnight'>No connections to display...</div>
      ) : (
        connections?.map((item, index) => (
          <div className='relative hover:drop-shadow-md rounded-lg py-1 w-full' key={index}>
            <div className='flex items-center'>
              <ConnectionPreview key={index} item={item} session={session} />
              <div
                className={`ml-2 bg-red rounded-full w-6 h-8 flex items-center justify-center ${
                  deleteConnections ? '' : 'hidden'
                }`}
              >
                <Dialog.Root key={index}>
                    <Dialog.Trigger>
                        <Trash2 key={index} />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <div
                            style={{ zIndex: 2147483647, position: 'absolute'}}
                            className=' left-8 top-40'
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50" />
                            <Dialog.Content className="bg-white border-4 border-midnight rounded-lg p-4 drop-shadow-2xl shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <Dialog.Title className="DialogTitle">Confirm Delete</Dialog.Title>
                                <Dialog.Description className="DialogDescription">
                                    You are going to remove this connection.
                                </Dialog.Description>
                                <div style={{ display: 'flex', marginTop: 25, justifyContent: 'space-between' }}>
                                    <Dialog.Close asChild>
                                        <Button 
                                            className="bg-softGreen text-midnight hover:text-white"
                                            onClick={()=>deleteConnection(index)}
                                        >
                                            Yes
                                        </Button>
                                    </Dialog.Close>
                                
                                    <Dialog.Close asChild>
                                        <Button aria-label="Close" className='bg-red text-midnight hover:text-white'>
                                            Cancel
                                        </Button>
                                    </Dialog.Close>
                                </div>
                            </Dialog.Content>
                        </div>
                    </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ConnectionsList;
