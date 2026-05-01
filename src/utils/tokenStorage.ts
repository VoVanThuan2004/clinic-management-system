const ACCESS_TOKEN_KEY = "access_token";
// const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  getAccessToken: () => {
    return localStorage.getItem("access_token");
  },
  setAccessToken: (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  // getRefreshToken: () => {
  //   return localStorage.getItem("refresh_token");
  // },
  // setRefreshToken: (refreshToken: string) => {
  //   localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  // },
  clear: () => {
    localStorage.clear();
  },
};
