import Axios from 'axios';

const api = Axios.create({
  //baseURL: 'http://localhost:3333',
  baseURL: 'http://192.168.0.124:3333'
});

export default api;
