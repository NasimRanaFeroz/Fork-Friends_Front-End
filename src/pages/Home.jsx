import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageSlider from '../components/ImageSlider';

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ImageSlider />
        {/* <CategorySection /> */}
        {/* Add more sections as needed */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;