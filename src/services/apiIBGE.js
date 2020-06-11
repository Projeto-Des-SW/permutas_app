import Axios from 'axios';

const apiIbge = Axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1'
});

export default apiIbge;
