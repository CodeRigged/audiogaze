import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import config from "@/config";

const axiosInstance = axios.create({ baseURL: config.apiEndpoint });

Vue.use(VueAxios, axiosInstance);
