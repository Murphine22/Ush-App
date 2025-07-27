import React, { useState, useEffect } from 'react';

const FinancialImages = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = [
    "https://i.imgur.com/S1xIt10.jpg",
    "https://i.imgur.com/WgddOCx.jpg",
    "https://i.imgur.com/EbGZoAk.jpg",
    "https://i.imgur.com/21t767E.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-48 overflow-hidden rounded-lg shadow-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Finance ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Financial Excellence</h3>
              <p className="text-lg">Transparent • Accountable • Faithful</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialImages;