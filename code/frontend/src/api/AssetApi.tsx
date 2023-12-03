import axios from 'axios';
import { UploadedAsset } from '../types/Asset';

let prodDNS:string = import.meta.env.VITE_URI
let baseDNS:string = prodDNS ? prodDNS : 'http://127.0.0.1:6400';
const BASE_URL = baseDNS +  '/api/v1/assets';

export const assetApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer ' + (localStorage.getItem("access_token") ? localStorage.getItem("access_token")?.slice(1, -1) : '')
  }
});

export const fetchAssets = async(purchased: boolean, get_uploaded: boolean, searchTerm: String | null, page: number | null) => {
  const params = {
      purchased: purchased,
      get_uploaded: get_uploaded
  }
  if (searchTerm) {
      params['search_term'] = searchTerm;
  }
  if (page) {
          params['page'] = page;
  }
  const response = await assetApi.get('', {params: params});
  return response.data;
}

export const uploadAsset = async(asset: UploadedAsset) => {
    const response = await assetApi.post('', asset, {
        headers: {'Content-Type': 'multipart/form-data'}
    });
    return response.data;
}

export const purchaseAsset = async(id) => {
    const response = await assetApi.post('/' + id, {
        headers: {'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (localStorage.getItem("access_token") ? localStorage.getItem("access_token")?.slice(1, -1) : '')}
    });
    return response.data;
}

export const deleteAsset = async(id) => {
    const response = await assetApi.delete('/' + id, {
        headers: {'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (localStorage.getItem("access_token") ? localStorage.getItem("access_token")?.slice(1, -1) : '')}
    });
    return response.data;
}