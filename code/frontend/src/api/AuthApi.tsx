import axios from 'axios';
import { User } from '../types/User';

let prodDNS:string = import.meta.env.VITE_URI
let baseDNS:string = prodDNS ? prodDNS : 'http://127.0.0.1:6400';
const BASE_URL = baseDNS + '/api/v1/users';

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      'Content-Type': 'application/json'
    }
  }
});

export const createUser = async(user: User) => {
    const response = await authApi.post('signup', user);
    return response
}

export const loginUser = async (credentials: {username: string, password: string}) => {
  const response = await authApi.post('login', credentials);
  return response.data
};
