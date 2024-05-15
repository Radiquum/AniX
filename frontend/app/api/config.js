export let API_URL = "/api/v1";

if (process.env.API_URL) {
  API_URL = process.env.API_URL;
}

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
    bookmarks: {
      list: `${API_URL}/bookmarks/list`,
      history: `${API_URL}/bookmarks/history`,
      watching: `${API_URL}/bookmarks/watching`,
      planned: `${API_URL}/bookmarks/planned`,
      watched: `${API_URL}/bookmarks/watched`,
      delayed: `${API_URL}/bookmarks/delayed`,
      abandoned: `${API_URL}/bookmarks/abandoned`,
    },
    favorites: `${API_URL}/favorites`,
  },
  release: `${API_URL}/release`,
};
