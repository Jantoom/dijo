import {
    ReactNode,
    createContext,
    useMemo,
    useContext
  } from 'react';
  
  interface AuthContextType {
    login: (token: string, userID: string) => void;
    logout: () => void;
    getAccessToken: () => string | null;
  }
  
  const AuthContext = createContext<AuthContextType>({} as AuthContextType);
  
  export function AuthProvider({
    children,
  }: {
    children: ReactNode;
  }): JSX.Element {

    function login(token: string) {
      localStorage.setItem("access_token", token)
    }
  
    function logout() {
      localStorage.removeItem("access_token")
    }

    function getAccessToken() {
      return localStorage.getItem("access_token")
    }
  
    const memoizedValue = useMemo(
      () => ({
        login,
        logout,
        getAccessToken      
    }),
      [login, logout, getAccessToken],
    );
  
    return (
      <AuthContext.Provider value={memoizedValue}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export default function useAuth() {
    return useContext(AuthContext);
  }