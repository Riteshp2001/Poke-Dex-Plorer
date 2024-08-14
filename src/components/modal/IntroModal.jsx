import React from "react";
import { usePokemonModal } from "../../context/PokemonModalProvider";
import { getTypeIconSrc } from "../../utils/pokemon-helper";

const IntroModal = () => {
  const { currentPokemon, closeModal } = usePokemonModal();

  return (
    <div className="pokemon-intro">
      <span className="parent-arrow">
        <span className="arrow-back" onClick={closeModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="48px"
            viewBox="0 -960 960 960"
            width="48px"
            fill="#e8eaed"
          >
            <path d="M480-416 281-218q-13 13-32 13.5T218-218q-14-13-14-31.5t14-32.5l199-198-199-199q-14-13-14-31.5t14-32.5q12-13 31-12.5t32 13.5l199 198 199-198q13-13 32-13.5t31 12.5q14 14 14 32.5T743-679L544-480l199 198q13 14 13 32.5T742-218q-12 14-31 13.5T679-218L480-416Z" />
          </svg>
        </span>
      </span>

      <div className="current-pokemon">
        <img src={currentPokemon.imgSrc} alt="Pokemon-Image" />

        <div>
          <span className="id-number">#{currentPokemon.paddedId}</span>
          <span className="pokemon-name">{currentPokemon.name}</span>

          <div className="types">
            {currentPokemon.types.map(({ name }) => {
              const typeImg = getTypeIconSrc(name);

              return (
                <div key={name} className={name}>
                  <img src={typeImg} alt={name} />
                  <span className="type-name">{name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;
