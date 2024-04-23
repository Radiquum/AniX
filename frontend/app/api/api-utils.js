export const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error("Ошибка получения данных");
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const authorize = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });
    if (response.status !== 200) {
      throw new Error("Ошибка получения данных");
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const getMe = async (url, jwt) => {
  try {
    const response = await fetch(`${url}?token=${jwt}&short=True`, {
      method: "GET",
    });
    if (response.status !== 200) {
      throw new Error("Ошибка получения данных");
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

export function setJWT(jwt) {
  localStorage.setItem("jwt", jwt);
}
export function getJWT() {
  return localStorage.getItem("jwt");
}
export function removeJWT() {
  localStorage.removeItem("jwt");
}
