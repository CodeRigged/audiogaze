import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import {config} from '@/config';

// configure axios http-client
const axiosInstance = axios.create({
  baseURL: config.apiEndpoint,
});

// pass axios instance to VueAxios
Vue.use(VueAxios, axiosInstance);
