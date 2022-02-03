const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://localhost:3000/',
});

var refreshToken;

// Verifier si le compte existe en BDD
instance.post('/auth/login', {
  email: 'gabrieldelahaye76680@gmail.com',
  password: '1234'
}).then((response) => {
  instance.defaults.headers.common['authorization'] = `Bearer f${response.data.accessToken}`;
  refreshToken = response.data.refreshToken;
  loadUserInfos();
}).catch((err) => {
  console.log(err.response.status);
});

function loadUserInfos() {
  instance.get('/auth/me').then((response) => {
    console.log(response.data);
  }).catch((err) => {
    console.log(err.response.status);
  });
}

instance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;
  if (error.config.url != '/auth/refresh-token' && error.response.status === 401 && originalRequest._retry !== true) {
    originalRequest._retry = true;
    if (refreshToken && refreshToken != '') {
      instance.defaults.headers.common['authorization'] = `Bearer ${refreshToken}`;
      await instance.post('/auth/refresh-token').then((response) => {
        instance.defaults.headers.common['authorization'] = `Bearer ${response.data.accessToken}`;
        originalRequest.headers['authorization'] = `Bearer ${response.data.accessToken}`;
      }).catch((error) => {
        console.log(error.response.status);
        refreshToken = null;
      });
      return instance(originalRequest);
    }
  }
});