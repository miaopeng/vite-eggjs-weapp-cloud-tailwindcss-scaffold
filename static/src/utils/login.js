import request from './request';

export const getAuth = () =>
  JSON.parse(localStorage.getItem('arena.auth') || '{}');

export const getToken = () => getAuth().access_token;

export const isAuthenticated = () => {
  const { access_token, expires_in, timestamp } = getAuth();
  if (!access_token || !expires_in || !timestamp) return false;
  return (Date.now() - timestamp) / 1000 < expires_in;
};

export const fetchAuthData = async () => {
  const { data } = await request('/api/login');
  if (data && data.access_token) {
    return data;
  }
};

export default async () => {
  try {
    if (isAuthenticated()) {
      return Promise.resolve({ data: 'ok' });
    }

    const authData = await fetchAuthData();

    if (authData) {
      localStorage.setItem(
        'arena.auth',
        JSON.stringify({ ...authData, timestamp: Date.now() })
      );

      return Promise.resolve({ data: 'ok' });
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};
