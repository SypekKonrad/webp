// import axios from 'axios';
 import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default httpClient