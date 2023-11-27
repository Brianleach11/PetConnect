import Image from "next/image";
import React, { useState, FC } from "react";

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
      {isLoading && <p>Loading image...</p>}
      <div onClick={handleImageClick} style={{ cursor: 'pointer' }}>
        <Image
          src={imageUrl}
          alt="Uploaded Pet"
          loading="eager"
          onLoad={() => setIsLoading(false)}
          onError={() => console.error('Failed to load image at:', imageUrl)}
          style={{ display: isLoading ? 'none' : 'block' }}
          width='300'
          height='300'
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
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageComponent;