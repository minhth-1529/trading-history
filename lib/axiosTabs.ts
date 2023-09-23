import axios from 'axios';
import { headers } from '@/module/constants';

const PATTERN_ID = '650c558b54105e766fb7a85d';

export const fetchPattern = () => {
  return axios.get(`https://api.jsonbin.io/v3/b/${PATTERN_ID}`, {
    headers,
  });
};

export const handlePutPattern = (data: string[]) => {
  return axios
    .put(`https://api.jsonbin.io/v3/b/${PATTERN_ID}`, data, {
      headers,
    })
};
