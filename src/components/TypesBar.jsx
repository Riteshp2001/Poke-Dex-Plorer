import React, { useState } from 'react';
import useTypes from '../hooks/useTypes';
import { getTypeIconSrc } from '../utils/pokemon-helper';

const TypesBar = ({ toggleType,type }) => {
    const types = useTypes();
    const [selectedType, setSelectedType] = useState(type);

    const handleTypeClick = (name) => {
        setSelectedType(name);
        toggleType(name);
    };

    return (
        <nav className='types-bar'>
            <a
                key={'all'}
                className={`all ${selectedType === 'all' ? 'selected' : ''}`}
                onClick={() => handleTypeClick('all')}
            >
                <img src={getTypeIconSrc('all')} alt={name} />
            </a>
            {
                types.map(({ name }) => {
                    const typeImg = getTypeIconSrc(name);
                    return (
                        <a
                            key={name}
                            className={`${name} ${selectedType === name ? 'selected' : ''}`}
                            onClick={() => handleTypeClick(name)}
                        >
                            <img src={typeImg} alt={name} />
                        </a>
                    );
                })
            }
        </nav>
    );
};

export default TypesBar;
