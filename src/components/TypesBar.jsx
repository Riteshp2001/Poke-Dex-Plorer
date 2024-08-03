import React, { useState } from 'react';
import useTypes from '../hooks/useTypes';
import { getTypeIconSrc } from '../utils/pokemon-helper';

const TypesBar = ({ toggleType }) => {
    const types = useTypes();
    const [selectedType, setSelectedType] = useState(null);

    const handleTypeClick = (name) => {
        setSelectedType(name);
        toggleType(name);
    };

    return (
        <nav className='types-bar'>
            {
                types.map(({ name }) => {
                    const typeImg = getTypeIconSrc(name);

                    return (
                        name !== "stellar" && (
                            <a
                                key={name}
                                className={`${name} ${selectedType === name ? 'selected' : ''}`}
                                onClick={() => handleTypeClick(name)}
                            >
                                <img src={typeImg} alt={name} />
                            </a>
                        )
                    );
                })
            }
        </nav>
    );
};

export default TypesBar;
