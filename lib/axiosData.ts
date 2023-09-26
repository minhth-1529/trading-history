import axios from 'axios';
import { TOriginDataType } from '@/module/interface';
import { headers } from '@/module/constants';

const DATA_ID = '650979ed205af66dd4a181ec';

export const fetchData = () => {
  return axios.get(`https://api.jsonbin.io/v3/b/${DATA_ID}`, { headers });
};

export const handlePutData = (data: TOriginDataType) => {
  return axios
    .put(`https://api.jsonbin.io/v3/b/${DATA_ID}`, data, {
      headers,
    })

};
