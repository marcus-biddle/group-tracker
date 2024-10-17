import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Header } from './sections/Header'
import { Introduction } from './sections/Home/Introduction'
import { IntroList } from './sections/Home/IntroList'
import { Outlet, useLocation, useMatches } from 'react-router'
import { isAuthenticated } from './helpers/authHelper'

function App() {
  const COLOR_PATH_CHART = [
    {params: '1', BgColor: 'bg-teal-300'},
    {params: '2', BgColor: 'bg-red-300'},
    {params: '3', BgColor: 'bg-green-500'},
  ];

  const matches = useMatches();
  const matchedPath = COLOR_PATH_CHART.find(item => item.params === matches[0].params.activityId);

  // console.log(matches[0].params.activityId);

  return (
    <div className={`${matchedPath ? matchedPath.BgColor : ' bg-neutral-900'} min-h-screen`}>
      <Header />
      <div className=''>
        <Outlet />
      </div>
      
    </div>
  )
}

export default App
