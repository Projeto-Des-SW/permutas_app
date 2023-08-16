import Axios from 'axios';
import { REACT_APP_API_URL } from '@env';
const api = Axios.create({
  baseURL: REACT_APP_API_URL,
  // baseURL: 'http://192.168.1.11:3333'
  //baseURL: 'https://permutas.rj.r.appspot.com/'
});

export default api;
