import React, { createContext, useContext, useState } from "react";

interface HeaderContextProps {
  title: string;
  setTitle: (t: string) => void;
}

const HeaderContext = createContext<HeaderContextProps>({
  title: "",
  setTitle: () => {},
});

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = useState("Thông tin");
  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};
