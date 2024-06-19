/* eslint-disable */
import axios from 'axios';
const url = 'http://192.168.8.146:3000';

export class APIService {
  constructor() {
    this.service = axios.create();
  }

  handleSuccess(response) {
    return response;
  }

  async handleError(res) {
    return Promise.reject(res)
  }

  get(path, payload) {
    return this.service
      .get(`${url}${path}`, { ...payload })
      .then(res => this.handleSuccess(res))
      .catch(e => this.handleError(e, path, payload, "get"))
  }

  post(path, payload) {
    return this.service
      .request({
        method: "POST",
        url: `${url}${path}`,
        responseType: "json",
        data: payload,
      })
      .then(res => this.handleSuccess(res))
      .catch(res => this.handleError(res, path, payload, "post"))
  }
}

export default new APIService();
