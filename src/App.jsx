import './App.css';
import React, { Suspense, useState } from 'react';
import TypesBar from './components/TypesBar';
import PokemonsContainer from './components/PokemonsContainer';
import Modal from './components/modal/Modal';
import { PokemonModalProvider } from './context/PokemonModalProvider';
import Loader from './components/Loader';
import { getTypeIconSrc } from './utils/pokemon-helper';

function App() {
  const [type, setType] = useState('normal');
  
  const typeImg = getTypeIconSrc(type);

  return (
    <Suspense fallback={ <Loader /> }>
      <PokemonModalProvider>
          <div className='wrapper'>
            <h1 className='logo-pokemon'>Poké Dex Plorer</h1>

            <TypesBar toggleType={ setType } />
            
            {/* Display the selected type */}
            <div
            className={`selected-type ${type}`}
            style={{
              backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${typeImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {type ? `${type.toUpperCase()}` : 'Select a Pokémon Type'}
          </div>

            <PokemonsContainer type={ type } />
          </div>

          <Modal />
      </PokemonModalProvider>
    </Suspense>
  )
}

export default App
