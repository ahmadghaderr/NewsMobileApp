import axios from "axios";

const GNEWS_API_KEY = "60511e1073c51775acb66e8f220c1395"

export const getNews = () => {
  return axios.get(
    `https://gnews.io/api/v4/search?q=Google&lang=en&max=400&apikey=${GNEWS_API_KEY}`
  );
};

export default { getNews };
