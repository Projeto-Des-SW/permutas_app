import Axios from 'axios';

const api = Axios.create({
  // baseURL: 'http://192.168.1.11:3333',
  // baseURL: 'http://localhost:3333,
  baseURL: 'https://permutaservidor.herokuapp.com/'
});

export default api;
