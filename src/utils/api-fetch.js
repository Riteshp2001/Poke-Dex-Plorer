const base = 'https://pokeapi.co/api/v2';

export const apiFetch = async (endpoint: string) => {
    if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Invalid endpoint provided');
    }

    const url = base + endpoint;
    try {
        const res = await fetch(url);

        // Check for network errors
        if (!res.ok) {
            if (res.status === 404) {
                throw new Error(`Not Found: ${res.statusText}`);
            } else if (res.status >= 500) {
                throw new Error(`Server Error: ${res.statusText}`);
            } else {
                throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
            }
        }

        // Handle empty response body
        const text = await res.text();
        if (!text) {
            throw new Error('Empty response body');
        }

        // Try to parse the JSON
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Error parsing JSON response: ' + e.message);
        }
        
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};
