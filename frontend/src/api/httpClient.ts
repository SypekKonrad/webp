// import axios from 'axios';
 import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';

let baseURL = '';

if (window.location.hostname === 'localhost') {
  baseURL = 'http://localhost:8000/api';
} else if (window.location.hostname === 'konradsypek.xyz') {
  baseURL = 'http://konradsypek.xyz/api';
} else if (window.location.hostname === '3.120.128.190') {
  baseURL = 'http://3.78.229.131:1337/api';
} else if (window.location.hostname === '0.0.0.0') {
  baseURL = 'http://localhost:1337/api';
} else {
  baseURL = 'http://localhost:8000/api';
}

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default httpClient