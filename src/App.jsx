import { useState } from 'react'
import { Button } from "./components/ui/button.jsx"
import AboutMeWidget from "./components/AboutMeWidget.jsx"
import GalleryWidget from './components/GalleryWidget.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="min-h-screen bg-black text-white flex">
      <div className="hidden md:block md:w-1/2" />

      <div className="w-full md:w-1/2 p-8 flex flex-col gap-8">
        <AboutMeWidget />
        <GalleryWidget />
      </div>
    </div>
    </>
  )
}

export default App
