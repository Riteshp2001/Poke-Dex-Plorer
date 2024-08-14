import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";
import usePokemons from "../hooks/usePokemons";
import PokemonCard from "./PokemonCard";
import { debounce } from "lodash";

const PokemonsContainer = ({ type, setTypeColor }) => {
  const allPokemons = usePokemons(type);

  const [selectedPokemons, setSelectedPokemons] = useState([]);

  // Memoize Pokémon data to avoid unnecessary re-renders
  const availablePokemons = useMemo(() => {
    return allPokemons.filter(
      (pokemon) =>
        !selectedPokemons.some((selected) => selected.id === pokemon.id)
    );
  }, [allPokemons, selectedPokemons]);

  // Debounced function for handling Pokémon selection change
  const handlePokémonChange = useCallback(
    debounce((event, newValue) => {
      setSelectedPokemons(newValue);
    }, 800),
    []
  );

  const typeColors = useMemo(
    () => ({
      all: "#FF0000",
      bug: "#8cb230",
      dark: "#58575f",
      dragon: "#0f6ac0",
      electric: "#eed535",
      fairy: "#ed6ec7",
      fighting: "#d04164",
      fire: "#fd7d24",
      flying: "#748fc9",
      ghost: "#556aae",
      grass: "#62b957",
      ground: "#dd7748",
      ice: "#61cec0",
      normal: "#9da0aa",
      poison: "#a552cc",
      psychic: "#ea5d60",
      rock: "#baab82",
      steel: "#417d9a",
      water: "#4a90da",
    }),
    []
  );

  useEffect(() => {
    setTypeColor(typeColors[type]);
  }, [type, setTypeColor, typeColors]);

  return (
    <div className="pokemons-container-wrapper">
      <Autocomplete
        multiple
        isOptionEqualToValue={(option, value) => {
          return (
            option.id == value.id &&
            option.uniqueKey == value.uniqueKey
          );
        }}
        options={availablePokemons.map((pokemon) => ({
          label: pokemon.name,
          id: pokemon.id,
          uniqueKey: pokemon.uniqueKey,
        }))}
        getOptionLabel={(option) => option.label || ""}
        value={selectedPokemons}
        onChange={handlePokémonChange}
        disablePortal
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
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
              },
            }}
            label={`Search ${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Pokemon`}
          />
        )}
        className="pokemon-dropdown"
        style={{ backgroundColor: typeColors[type] }}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.label}
              key={option.uniqueKey}
              {...getTagProps({ index })}
              className="pokemon-chip"
            />
          ))
        }
      />

      <div
        className="pokemons-container"
        style={{ width: selectedPokemons.length > 0 ? "100%" : "auto" }}
      >
        {selectedPokemons.length > 0 ? (
          selectedPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.uniqueKey}
              pokemon={allPokemons.find((p) => p.id === pokemon.id)}
            />
          ))
        ) : allPokemons.length > 0 ? (
          allPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.uniqueKey} pokemon={pokemon} />
          ))
        ) : (
          <p>Loading Pokémon...</p>
        )}
      </div>
    </div>
  );
};

export default PokemonsContainer;
