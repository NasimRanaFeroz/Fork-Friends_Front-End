import React, { useState, useEffect } from 'react';
import image1 from '../assets/beauty.png';
import image2 from '../assets/food.png';
import image3 from '../assets/restaurant.png';

function ImageSlider() {
    const images = [image2, image3, image1];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full mx-auto h-159 bg-base-300">
            <div className="overflow-hidden relative h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        <div className="flex items-center justify-center h-full">
                            <div className="text-white text-4xl font-bold roboto-bold">Femboy Tahmid</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageSlider;
