export const API_URL = "/api";

export const endpoints = {
  index: {
    last: `${API_URL}/index/last`,
    ongoing: `${API_URL}/index/ongoing`,
    announce: `${API_URL}/index/announce`,
    finished: `${API_URL}/index/finished`,
  },
  search: `${API_URL}/search`,
  user: {
    profile: `${API_URL}/profile`,
    auth: `${API_URL}/auth`,
  },
};
