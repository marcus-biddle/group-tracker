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
import { HeaderDataProvider } from './context/HeaderDataContext'

function App() {
  const COLOR_PATH_CHART = [
    // {params: '1', BgColor: 'bg-teal-300'},
    // {params: '2', BgColor: 'bg-red-300'},
    // {params: '3', BgColor: 'bg-green-500'},
  ];

  const matches = useMatches();
  const matchedPath = COLOR_PATH_CHART.find(item => item.params === matches[0].params.activityId);

  // console.log(matches[0].params.activityId);

  return (
    <HeaderDataProvider>
      <div className={` min-h-screen bg-gradient-to-br from-black via-[#1C1422] to-[#2f2239]`}>
        <TopNav />
        <div className=''>
          <Outlet />
        </div>
      </div>
    </HeaderDataProvider>
  )
}

export default App
