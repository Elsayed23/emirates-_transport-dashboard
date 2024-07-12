'use client'
import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export function useOpen() {
    return useContext(Context);
}


export const IsOpenProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(true)


    return (
        <Context.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </Context.Provider>
    );
};
