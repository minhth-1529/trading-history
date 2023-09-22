import axios from "axios";
import { message } from "antd";
import { headers } from "@/module/constants";

const PATTERN_ID = "650c558b54105e766fb7a85d";

export const fetchTabs = () => {
  return axios.get(`https://api.jsonbin.io/v3/b/${PATTERN_ID}`, {
    headers,
  });
};

export const handleTabs = (data: string[]) => {
  axios
    .put(`https://api.jsonbin.io/v3/b/${PATTERN_ID}`, data, {
      headers,
    })
    .then(() => message.success("Added/Deleted successfully!"))
    .catch((err) => console.log(err));
};
