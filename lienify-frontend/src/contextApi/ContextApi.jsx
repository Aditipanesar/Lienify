
import { createContext, useContext, useState, useEffect } from "react";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const getToken = localStorage.getItem("JWT_TOKEN")
        ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
        : null;

    const [token, setToken] = useState(getToken);

    const savedTheme = localStorage.getItem("LIENIFY_THEME") || "light";
    const [theme, setTheme] = useState(savedTheme);

    const toggleTheme = () => {
        setTheme((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("LIENIFY_THEME", next);
            return next;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const sendData = {
        token,
        setToken,
        theme,
        toggleTheme,
    };

    return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>;
};

export const useStoreContext = () => {
    const context = useContext(ContextApi);
    return context;
};
