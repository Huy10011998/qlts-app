import { HeaderContextProps } from "@/types";
import React, { createContext, useContext, useState } from "react";

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
