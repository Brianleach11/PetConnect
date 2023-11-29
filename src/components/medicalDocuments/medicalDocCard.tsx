'use client'
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Document {
    basename: string;
    filename: string;
    url: string;
    downloadLink: string;
}
//    const petIdFromStorage = sessionStorage.getItem('clickedPetId');

const MedicalDocCard: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [editDocuments, setEditDocuments] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchDocuments() {
            if (documents.length > 0) return;

            const petIdFromStorage = sessionStorage.getItem('clickedPetId');

            try {
                const response = await fetch(`/api/getMedicalDocuments?petId=${petIdFromStorage}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch documents');
                }
                const data = await response.json();

                if (Array.isArray(data)) {
                    setDocuments(data as Document[]);
                } else {
                    console.error('Fetched data is not an array');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchDocuments();
    }, [documents]);

    const handleDocumentClick = (url: string) => {
        window.open(url, '_blank');
    };

    const handleDeleteDocuments = async (index: number) => {
        const filename = documents[index].basename
        const petId = documents[index].filename.split('/').at(2)

        if(!filename || !petId) return;
        
        const response = await fetch(`/api/deletePetPhoto?filename=${filename}&folder=MedicalDocuments&petId=${petId}`)
        
        if (!response.ok) {
            console.log('Failed to delete pet photo:', response.statusText);
            return;
          }

        router.refresh()
      }

    return (
        <div className='mb-4'>
            <ul>
                {documents.map((doc, index) => (
                    <div key={index} className='flex space-x-3 items-center'>
                        <li className="py-1">
                            <a
                                href="#"
                                onClick={() => handleDocumentClick(doc.downloadLink)}
                                className="text hover:underline hover:text-blue transition duration"
                            >
                                {doc.basename}
                            </a>
                        </li>
                        {
                            (editDocuments) &&
                            <Dialog.Root key={index}>
                                <Dialog.Trigger>
                                    <Trash2 key={index} className="relative bg-whiteGreen hover:bg-red rounded-sm" />
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                    <div
                                        style={{ zIndex: 2147483647, position: 'absolute' }}
                                        className=' left-8 top-40'
                                    >
                                        <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50" />
                                        <Dialog.Content className="bg-white border-4 border-midnight rounded-lg p-4 drop-shadow-2xl shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <Dialog.Title className=" font-semibold">Confirm Delete</Dialog.Title>
                                            <Dialog.Description className="DialogDescription">
                                                    Once a photo is deleted, it is unrecoverable.
                                            </Dialog.Description>
                                            <div style={{ display: 'flex', marginTop: 25, justifyContent: 'space-between' }}>
                                                <Dialog.Close asChild>
                                                    <Button
                                                        className="bg-softGreen text-midnight hover:text-white"
                                                        onClick={() => handleDeleteDocuments(index)}
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
                        }
                    </div>
                ))}
            </ul>
            <button
                className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
                onClick={() => setEditDocuments(!editDocuments)}
            >
                <Pencil />
            </button>
        </div>
    );
};

export default MedicalDocCard;