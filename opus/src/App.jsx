import { useState } from 'react'
import './App.css'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import OnStage from './components/OnStage';

function App() {
  return (
    <>
      <Header />
      <main>
        <OnStage />
      </main>
      <Footer />
    </>
  )
}

export default App;