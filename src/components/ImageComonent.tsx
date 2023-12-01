import Image from "next/image";
import React, { useState, FC, useEffect } from "react";
import {Spinner} from 'flowbite-react'

type ImageComponentProps = {
  imageUrl: string;
};

const ImageComponent: FC<ImageComponentProps> = ({ imageUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div>
      {isLoading && (
        <div className="flex justify-center w-48 h-48 sm:w-60 sm:h-60 md:w-75 md:h-75 items-center border-2 transition-all duration-500 bg-gradient-to-br to-white via-softGreen from-white animate-pulse">
          <Spinner color='info' size='lg'/>
        </div>
      )}
       <div onClick={handleImageClick} style={{ cursor: 'pointer'}} className="w-48 h-48 sm:w-60 sm:h-60 md:w-75 md:h-75
">
              <img 
                src={imageUrl} 
                alt="Uploaded Image"
                className="w-full h-full object-cover" 
                style={{ display: isLoading ? 'none' : 'block' }}
                onLoad={() => setIsLoading(false)}
                onError={() => console.error('Failed to load image at:', imageUrl)}
              />
      </div>

      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => setIsFullscreen(false)}
        >
          <Image
            src={imageUrl}
            alt="Fullscreen Uploaded Pet"
            loading = "eager"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageComponent;