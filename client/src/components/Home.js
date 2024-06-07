import React from 'react';
import Recipes from './Recipes/Recipes';
// import Header from './Header/Header';


function Home() {


  return (
    <div className='home'>

      <header>
        <h1>Blissful Bites</h1>
      </header>
      
        {/* <Header /> */}
        <Recipes />
      



    </div>
  );
}

export default Home;
