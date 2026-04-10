
// CRA / Vite / Next 환경별로 다름
const BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || "";

export const url = (params: string): string => {
  return BASE_URL + params;
};

export const got = async (
  urlParams: string = "",
  method: string = "GET",
  setParams?: Record<string, any>,
  accesstoken: string = "",
  formData: boolean = false
): Promise<any> => {

  let api: string = url(urlParams);

  let headers: any = {
    "Content-Type": "application/json;charset=utf-8",
  };

  if (accesstoken) {
    headers.Authorization = `Bearer ${accesstoken}`;
  }

  const options: any = {
    method,
    credentials: "include",
    headers,
  };

  if (method === "GET" && setParams) {
    const queryString = new URLSearchParams(setParams).toString();
    api = `${api}?${queryString}`;
  } else {
    if (formData) {
      const fd = new FormData();

      if (setParams) {
        Object.entries(setParams).forEach(([key, value]) => {
          fd.append(key, String(value));
        });
      }

      options.body = fd;
      delete options.headers["Content-Type"];
    } else {
      if (setParams) {
        options.body = JSON.stringify(setParams);
      }
    }
  }

  try {
    const response = await fetch(api, options);
    const res = await response.json();

    if (response.ok) return res;
    return { status: res.statusCode, message: res.message };

  } catch (error) {
    return { status: 0, message: "오류가 발생했습니다." };
  }
};

export const setCookie = (cookieName: string, value: any, expires: number = 0): void => {
  const date = new Date();
  date.setTime(date.getTime() + expires * 1000);

  if (expires === 0) {
    document.cookie = `${cookieName}=${encodeURIComponent(value)};path=/`;
  } else {
    document.cookie = `${cookieName}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
  }
};

export const getCookie = (cookieName: string): string => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let name = cookies[i].substring(0, cookies[i].indexOf("="));
    let data = cookies[i].substring(cookies[i].indexOf("=") + 1);

    name = name.trim();

    if (name === cookieName) {
      return decodeURIComponent(data);
    }
  }

  return "";
};

export const deleteCookie = (cookieName: string): void => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
};

// accessToken (crypto 그대로 사용 가능)
export const getAccessToken = async (path: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    JSON.stringify({
      uri: path,
      timestamp: new Date().toISOString(),
    })
  );

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};