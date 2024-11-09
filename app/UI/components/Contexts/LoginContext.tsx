import { useContext, createContext, useState } from "react";

interface LoginContextType {
  isLoggedIn: boolean;
  setLogin: (login: boolean) => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function useLoginContext() {
  const loginContext = useContext(LoginContext);
  if (loginContext === undefined) {
    throw new Error("Login was not loaded");
  }
  return loginContext;
}

export const LoginProvider: React.FC<{ children: any }> = ({ children }) => {
  const [isLoggedIn, setLogin] = useState<boolean>(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setLogin }}>
      {children}
    </LoginContext.Provider>
  );
};
