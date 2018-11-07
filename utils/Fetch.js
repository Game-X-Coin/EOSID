class Fetch {
  constructor({ baseURL = '' } = {}) {
    this.baseURL = baseURL;
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }

  async fetch({ url, data, method = 'GET' }) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method,
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return response.json();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  get(url, data) {
    return this.fetch({ url, data, method: 'GET' });
  }

  post(url, data) {
    return this.fetch({ url, data, method: 'POST' });
  }
}

export default Fetch;
