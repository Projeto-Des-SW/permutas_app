import Axios from 'axios';
//const apiIbge = ServiceEcommerce('https://servicodados.ibge.gov.br/api/v1', timeout);

const apiIbge = Axios.create({
  //baseURL: 'http://localhost:3333',
  //baseURL: 'http://192.168.0.124:3333'

  baseURL: 'https://servicodados.ibge.gov.br/api/v1'
});

export default apiIbge;