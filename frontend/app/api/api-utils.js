export const isResponseOk = (response) => {
  return !(response instanceof Error);
};

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    const response = await fetch(`${url}?token=${jwt}`, {
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

export function setJWT(jwt, user_id) {
  const data = { jwt: jwt, user_id: user_id };
  localStorage.setItem("data", JSON.stringify(data));
}
export function getJWT() {
  const data = localStorage.getItem("data");
  return JSON.parse(data);
}
export function removeJWT() {
  localStorage.removeItem("data");
}
