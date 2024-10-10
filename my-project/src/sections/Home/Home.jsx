import React from 'react'
import { Introduction } from './Introduction'
import { IntroList } from './IntroList'

export const Home = () => {
  return (
    <div className='p-6'>
        <Introduction />
        <IntroList />
    </div>
  )
}
