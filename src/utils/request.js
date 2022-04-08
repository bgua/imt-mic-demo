import { HTTP_METHOD } from "./constants";

const POST = HTTP_METHOD.POST, GET = HTTP_METHOD.GET;

export default function request(url, option) {
  if (!option) {
    option={}
    option.method = GET
  }
  let shadowOptions = {...option};
  // if (option.method === POST) {
  //   shadowOptions = checkIfDataHasFileObject(option);
  // }

  const newOptions = customizeOptions(shadowOptions);

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.respType && newOptions.respType === 'blob') {
        return response.blob();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      console.error(status, e);
    });
}

const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }


    const error = new Error(response.statusText);
    error.name = response.status;
    error.response = response;
    throw error;
};

const customizeOptions = (option) => {
    const newOptions = {
      ...option,
    };

    // const defaultOptions = {
    //   credentials: 'include',
    // };
    // const newOptions = { ...defaultOptions, ...options };
    if ( newOptions.method === POST ) {
      if (!(newOptions.body instanceof FormData)) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        };
        newOptions.body = JSON.stringify(newOptions.body);
      } else {
        // newOptions.body is FormData
        newOptions.headers = {
          Accept: 'application/json',
          ...newOptions.headers,
        };
      }
    }
    return newOptions;
  };
