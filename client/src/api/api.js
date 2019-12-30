import axios from 'axios';
import config from '../config'

const instance = axios.create();
instance.defaults.headers.common = {};
instance.defaults.headers.common.accept = 'application/json';

export const readMemory = () => {
  return axios.get(`${config.serverUrl}/readMemory`)
    .then(resp => resp.data);
};

export const writeMemory = (number) => {
  return axios.post(`${config.serverUrl}/writeMemory`, { "num": number })
    .then(resp => resp.data);
};