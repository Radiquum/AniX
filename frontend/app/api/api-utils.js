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
