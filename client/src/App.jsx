import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Header } from './sections/Header'
import { Introduction } from './sections/Home/Introduction'
import { IntroList } from './sections/Home/IntroList'
import { Outlet, useLocation, useMatches } from 'react-router'

function App() {
  const COLOR_PATH_CHART = [
    {params: 'pushups', BgColor: 'bg-yellow-300'},
    {params: 'pullups', BgColor: 'bg-blue-500'},
    {params: 'running', BgColor: 'bg-orange-500'},
  ];

  const matches = useMatches();
  const matchedPath = COLOR_PATH_CHART.find(item => item.params === matches[0].params.activityId);

  return (
    <div className={`${matchedPath ? matchedPath.BgColor : 'bg-white'} min-h-[100vh]`}>
      <Header />
      <div className=''>
        <Outlet />
      </div>
      
    </div>
  )
}

export default App
