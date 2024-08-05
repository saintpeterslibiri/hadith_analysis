import React from 'react';

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <section className="text-center mb-8">
        <h1 className="head_text">
          HadisHub
          <br className="max-md:hidden" />
          <span className="blue_gradient">Hadiths & Ravis Analysis</span>
        </h1>
        <p className="desc">
          Analysis and visualization of Hadiths
        </p>
      </section>

    </div>
  );
};

export default Home;