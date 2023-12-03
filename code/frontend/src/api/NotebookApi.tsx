import axios from 'axios';

let prodDNS:string = import.meta.env.VITE_URI
let baseDNS:string = prodDNS ? prodDNS : 'http://127.0.0.1:6400';
const BASE_URL = baseDNS +  '/api/v1/notebooks';

export const notebookApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      'Content-Type': 'application/json'
    },
    Authorization: 'Bearer ' + (localStorage.getItem("access_token") ? localStorage.getItem("access_token")?.slice(1, -1) : '')
  }
});

// TODO: get rid of desription field
export const createNotebook = async(notebook: {title: string, description: string}) => {
  const response = await notebookApi.post('', notebook);
  return response.data
}

export const fetchNotebooks = async() => {
  const response = await notebookApi.get('');
  return response.data
}

export const createPage = async(page: {notebookID: string, title: string, content: string}) => {
  const response = await notebookApi.post(`/${page.notebookID}`, 
  {
    "title": page.title,
    "content": page.content
  })
  return response.data
}

export const fetchPage = async(page: {notebookID: string, pageIndex: number}) => {
  const response = await notebookApi.get(`/${page.notebookID}/${page.pageIndex}`)
  return response.data
}

export const updatePage = async(page: {notebookID: string, pageIndex: number, title: string, content: string}) => {
  const response = await notebookApi.put(`/${page.notebookID}/${page.pageIndex}`, 
  {
    "title": page.title,
    "content": page.content
  })
  return response.data
}

export const deleteNotebook = async(id: string) => {
    const response = await notebookApi.delete('/' + id);
    return response.data;
}