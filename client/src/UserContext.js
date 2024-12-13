import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a Context for the user state
const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check if the user is logged in by checking localStorage
    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setUser({ email });
        }
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};
