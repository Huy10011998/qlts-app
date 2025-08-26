import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
  isSearchOpen: boolean;
  toggleSearch: () => void;
  openSearch: () => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const openSearch = () => setIsSearchOpen(true);

  return (
    <SearchContext.Provider value={{ isSearchOpen, toggleSearch, openSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
};
