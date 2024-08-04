import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import usePokemons from '../hooks/usePokemons';
import PokemonCard from './PokemonCard';

const PokemonsContainer = ({ type, setTypeColor }) => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState([]);

  const allPokemons = usePokemons(type);

  useEffect(() => {
    setPokemons(allPokemons);
    setSelectedPokemons([]);
  }, [type, allPokemons]);

  const availablePokemons = pokemons.filter(
    pokemon => !selectedPokemons.some(selected => selected.id === pokemon.id)
  );

  const handlePokémonChange = (event, newValue) => {
    setSelectedPokemons(newValue);
  };

  const typeColors = {
    all: '#FFD700',
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
    backgroundColor: type ? typeColors[type] : '#fff',
  };

  useEffect(() => {
    setTypeColor(typeColors[type]);
  }, [type, setTypeColor]);

  return (
    <div className='pokemons-container-wrapper'>
      <Autocomplete
        multiple
        isOptionEqualToValue={(option, value) => option.id === value.id}
        options={availablePokemons.map(pokemon => ({
          label: pokemon.name || '',
          id: pokemon.id,
        }))}
        getOptionLabel={(option) => {
          if (!option || !option.label) {
            console.error("Option is invalid:", option);
            return '';
          }
          return option.label;
        }}
        value={selectedPokemons}
        onChange={handlePokémonChange}
        disablePortal
        renderInput={(params) =>
          <TextField {...params} sx={{
            "& .MuiAutocomplete-inputRoot": {
              paddingLeft: "20px !important",
              borderRadius: "12px",
            },
            "& .MuiInputLabel-outlined": {
              borderRadius: "12px",
            },
            "& .MuiInputLabel-shrink": {
              color: "black !important",
              fontWeight: "bold !important",
              textShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
              paddingRight: 0,
            }
          }}
            label={`Search ${type.charAt(0).toUpperCase() + type.slice(1)} Pokemon`}
          />}
        className='pokemon-dropdown'
        style={dropdownStyle}
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
