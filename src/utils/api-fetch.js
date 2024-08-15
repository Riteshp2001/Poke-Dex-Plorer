const base = 'https://pokeapi.co/api/v2';

export const apiFetch = async (endpoint) => {
    if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Invalid endpoint provided');
    }
    const res = await fetch(base + endpoint);
    if(res.status === 404) {
        throw {
            status: 404,
            message: res.statusText
        };
    }

    return res.json();
};
