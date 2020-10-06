import { useState, useEffect } from 'react';

export default httpClient => {
  const [error, setError] = useState(null);

    const reqInteceptor = httpClient.interceptors.request.use(req => {
      setError(null);
      return req;
    });

    const resInteceptor = httpClient.interceptors.response.use(res => res, err => {
      setError(err);
    });

    useEffect(() => {
      return () => {
        httpClient.interceptors.request.eject(reqInteceptor);
        httpClient.interceptors.response.eject(resInteceptor);
      };
    }, [reqInteceptor, resInteceptor]);

    const errorConfirmedHandler = () => {
      setError(null);
    }

    return [error, errorConfirmedHandler];
}