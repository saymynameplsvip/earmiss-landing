import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL ?? "https://api.earmiss.ru";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptors setup
export const setupInterceptors = (auth) => {
  const requestId = api.interceptors.request.use((config) => {
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    return config;
  });

  const responseId = api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          if (!auth.refreshToken) throw new Error("No refresh token");
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: auth.refreshToken });
          auth.saveJwt(data.jwt);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          console.error("Refresh token expired", err);
          auth.setAccessToken(null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.request.eject(requestId);
    api.interceptors.response.eject(responseId);
  };
};
