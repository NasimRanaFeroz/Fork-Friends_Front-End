import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-base-300">
      <Navbar />
      <main className="flex-grow">
        <ImageSlider />
      </main>
      <Footer />
    </div>
  );
}

export default Home;