import { useState } from 'react'
import './css/App.css'
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import OnStage from './components/OnStage';
import Goods from './components/Goods';

function App() {
  return (
    <>
      <Header />
      <main>
        <Goods />
      </main>
      <Footer />
    </>
  )
}

export default App;