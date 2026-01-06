import axios from "axios";

const GNEWS_API_KEY = "18e073f50169b31ea24c1efeefedf920"

export const getNews = (currentPage: number, searchQuery: string = 'Google') => {
  return axios.get(
    `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&max=10&apikey=${GNEWS_API_KEY}&page=${currentPage}`
  );
};
export default { getNews };
