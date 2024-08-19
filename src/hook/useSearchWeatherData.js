import { useState } from 'react';

export const useSearchWeatherData = (fetchLocationData) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchLocationData(searchQuery);
    };

    return { searchQuery, setSearchQuery, handleSearchSubmit };
};
