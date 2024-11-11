import axios from "axios";

const client = axios.create({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

export default client;
