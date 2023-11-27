import React, { useEffect, useState } from 'react';

interface Document {
    basename: string;
    filename: string;
    url: string;
    downloadLink: string;
  }
//    const petIdFromStorage = sessionStorage.getItem('clickedPetId');

const MedicalDocCard: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);

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

    return (
        <div className='mb-4'>
            <ul>
                {documents.map((doc, index) => (
                    <li key={index} className="py-1">
                        <a 
                            href="#" 
                            onClick={() => handleDocumentClick(doc.downloadLink)}
                            className="text hover:underline hover:text-blue transition duration"
                        >
                            {doc.basename}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalDocCard;