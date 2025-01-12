import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { USER_ROUTES, ADMIN_ROUTES } from '../../config/routeConsts';
import { isAdmin } from '../../config/jwtToken';
import {ICONS} from "../../config/icons.ts";

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search globally here...", onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const routes = isAdmin() ? ADMIN_ROUTES : USER_ROUTES;
        const routeValues = Object.values(routes);
        setSuggestions(routeValues);
    }, []);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            if (onSearch) {
                onSearch(searchQuery);
            } else {
                navigate(searchQuery);
            }
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        navigate(suggestion);
    };

    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.searchWrapper}>
            <form className={styles.searchForm} role="search" onSubmit={handleSearchSubmit}>
                <img
                    src={ICONS.searchIcon}
                    alt=""
                    className={styles.searchIcon}
                />
                <input
                    id="search"
                    type="search"
                    placeholder={placeholder}
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && filteredSuggestions.length > 0 && (
                    <div className={styles.dropdown}>
                        <ul className={styles.suggestionsList}>
                            {filteredSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchBar;
