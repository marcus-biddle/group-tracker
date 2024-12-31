import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TopNav } from './sections/TopNav'
import { Introduction } from './sections/Home/Introduction'
import { IntroList } from './sections/Home/IntroList'
import { Outlet, useLocation, useMatches } from 'react-router'
import { isAuthenticated } from './helpers/authHelper'

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  

  return (
      <div className={`relative min-h-screen bg-[#2b353e]`}>
        <TopNav />
        <div className=''>
          <Outlet />
        </div>
      </div>
  )
}

export default App
