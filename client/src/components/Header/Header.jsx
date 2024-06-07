import React from 'react';
import blissfulbiteslogo from '../../Images/smallbb.png';
import './header.css';


export default function Header() {
  return (
      <div className='header-container'>
        <div className='logo'>
          <img src={blissfulbiteslogo} alt='Blissful Bites Logo' />
        </div>
      </div>

  )
}
