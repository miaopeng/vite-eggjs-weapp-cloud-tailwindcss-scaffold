/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { API_URL } from './constants';
import { getToken } from './login';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  console.log('request error', error);
  const { response } = error;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;
    console.log('status', status);

    switch (status) {
      case 401:
        console.log('401');
        // history.pushState({}, '', '/login');
        window.user.logout();
        return response;

      default:
        break;
    }

    throw new Error(errorText);
  } else if (!response) {
    // console.error(error);
    throw new Error('网络异常');
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const access_token = getToken();
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  params: { access_token },
});

// export default request;
export const defaultNormalizer = (data) => data;

export const requestWrapper = (url, options = {}) => {
  const { normalizer = defaultNormalizer, silent, ...args } = options;

  if (url.startsWith('/api/')) {
    url = url.replace('/api', API_URL);
  }

  const checkData = (data) => {
    const { errors } = data;
    if (errors && !silent) {
      return { errors };
    }
    return data;
  };

  const headers = {};

  return request(url, { ...args, headers: { ...headers, ...args.headers } })
    .then(checkData)
    .then(normalizer)
    .catch((errors) => ({ errors }));
};

export default requestWrapper;
