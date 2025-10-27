import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL ?? "https://d5d3kh6vigfafsdv1ukv.4b4k4pg5.apigw.yandexcloud.net";

export const api = axios.create({
  baseURL: BASE_URL,
});