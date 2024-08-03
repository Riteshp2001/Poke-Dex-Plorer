import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import usePokemons from '../hooks/usePokemons';
import PokemonCard from './PokemonCard';

const PokemonsContainer = ({ type }) => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);

  const allPokemons = usePokemons(type);

  useEffect(() => {
    setPokemons(allPokemons);
    setSelectedPokemons([]);
  }, [allPokemons, type]);

  const availablePokemons = pokemons.filter(
    pokemon => !selectedPokemons.some(selected => selected.id === pokemon.id)
  );

  const handlePokémonChange = (event, newValue) => {
    const uniquePokemons = Array.from(
      new Map(newValue.map(pokemon => [pokemon.id, pokemon])).values()
    );
    setSelectedPokemons(uniquePokemons);
  };

  // Define color based on type
  const typeColors = {
    bug: '#8cb230',
    dark: '#58575f',
    dragon: '#0f6ac0',
    electric: '#eed535',
    fairy: '#ed6ec7',
    fighting: '#d04164',
    fire: '#fd7d24',
    flying: '#748fc9',
    ghost: '#556aae',
    grass: '#62b957',
    ground: '#dd7748',
    ice: '#61cec0',
    normal: '#9da0aa',
    poison: '#a552cc',
    psychic: '#ea5d60',
    rock: '#baab82',
    steel: '#417d9a',
    water: '#4a90da',
  };

  const dropdownStyle = {
    backgroundColor: type ? typeColors[type] : '#fff', // Background color based on type
  };

  return (
    <div className='pokemons-container-wrapper'>
      <Autocomplete
        multiple
        options={availablePokemons.map(pokemon => ({
          label: pokemon.name,
          id: pokemon.id,
        }))}
        getOptionLabel={(option) => option.label}
        value={selectedPokemons}
        onChange={handlePokémonChange}
        renderInput={(params) => <TextField {...params} label='Select Pokémon' />}
        className='pokemon-dropdown'
        style={dropdownStyle} // Apply dynamic style
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.label}
              {...getTagProps({ index })}
              className='pokemon-chip'
            />
          ))
        }
      />

      <div className='pokemons-container'
        style={{ width: selectedPokemons.length > 0 ? '100%' : 'auto' }}>
        {selectedPokemons.length > 0 ? (
          selectedPokemons.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemons.find(p => p.id === pokemon.id)} />
          ))
        ) : (
          pokemons.length > 0 ? (
            pokemons.map(pokemon => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))
          ) : (
            <p>Loading Pokémon...</p>
          )
        )}
      </div>
    </div>
  );
};

export default PokemonsContainer;
