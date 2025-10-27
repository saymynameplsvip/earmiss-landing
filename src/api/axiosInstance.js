import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL ?? "https://api.earmiss.ru";

export const api = axios.create({
  baseURL: BASE_URL,
});