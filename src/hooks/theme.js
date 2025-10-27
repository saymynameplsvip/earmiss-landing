import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 'system' = использовать системную тему, 'light' = светлая, 'dark' = тёмная
  const [theme, setTheme] = useState("system");
  const [systemTheme, setSystemTheme] = useState("light");

  // Определяем системную тему
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e) => setSystemTheme(e.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Переключение темы вручную
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme(systemTheme === "dark" ? "light" : "dark");
  };

  // Вычисляем активную тему
  const activeTheme = theme === "system" ? systemTheme : theme;

  // Применяем класс dark на <html> для Tailwind
  useEffect(() => {
    const root = window.document.documentElement;
    if (activeTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [activeTheme]);

  // Опционально: логируем темы
  useEffect(() => {
    console.log("System theme:", systemTheme);
    console.log("Current theme:", theme);
    console.log("Active theme:", activeTheme);
  }, [theme, systemTheme, activeTheme]);

  // Опционально: сохраняем выбор в localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
