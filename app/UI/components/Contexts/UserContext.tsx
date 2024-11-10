import { useContext, createContext, useState } from "react";

interface UserContextType {
  user_id: number | null;
  setUser: (user_id: number | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
  const userContext = useContext(UserContext);
  if (userContext === undefined) {
    throw new Error("Login was not loaded");
  }
  return userContext;
}

export const UserProvider: React.FC<{ children: any }> = ({ children }) => {
  const [user_id, setUser] = useState<number | null>(null);

  return (
    <UserContext.Provider value={{ user_id, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
