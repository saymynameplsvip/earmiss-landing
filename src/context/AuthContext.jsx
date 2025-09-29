import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [authCode, setAuthCode] = useState(localStorage.getItem("authCode") || null);

  const saveCode = (code) => {
    setAuthCode(code);
    localStorage.setItem("authCode", code);
  };

  const saveJwt = (jwt) => {
    setAccessToken(jwt.accessToken);
    localStorage.setItem("accessToken", jwt.accessToken);
    saveRefreshToken(jwt.refreshToken);
  };

  const saveRefreshToken = (token) => {
    setRefreshToken(token);
    localStorage.setItem("refreshToken", token);
  };

  return (
    <AuthContext.Provider value={{
      accessToken,
      refreshToken,
      authCode,
      saveCode,
      saveJwt,
      saveRefreshToken,
      setAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
