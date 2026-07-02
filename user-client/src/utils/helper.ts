import { type SignupType } from 'src/types/enum/userEnum';
import { createKey, encrypt } from './aes.utils';
import { popup } from './popup';
import { ApiPath } from 'src/types/enum/apiEnum';

export const url = (params: string): string => {
    return process.env.URL + params;
}

export const got = async (urlParams: string = "", method: string = "GET", setParams?: object, accesstoken:string = '', formData:boolean=false): Promise<any> => {

    let api: string = url(urlParams);

    let headers:any = {
      'Content-Type': 'application/json;charset=utf-8'
    }

    if (accesstoken != '') {
      headers = {
        ...headers,
        Authorization: `Bearer ${accesstoken}`
      }
    }


    let options: any = {
        method: method,
        credentials: 'include',
        headers,
    };

    if (method === 'GET' && setParams) {
        let queryString = new URLSearchParams(setParams as Record<string, string>).toString();
        api = `${api}?${queryString}`;
    } else {

        if (formData) {

          const fd = new FormData();
          if (setParams) {
            Object.entries(setParams).forEach(([key, value]) => {
              if (typeof value === 'object' || typeof value === 'string') {
                fd.append(key, value);
              } else {
                fd.append(key, String(value));
              }
                // value는 문자열이어야 함
            });
            options["mode"] ='cors'
            options["body"] = fd
            delete options.headers['Content-Type'];
          }
        } else {
          if (setParams) options["body"] = JSON.stringify(setParams);
        }       
    }

    try {
        const response:any = await fetch(api, options);
        const res = await response.json();
        if (response.ok) {
          return res
        } else {
          return { status: res.statusCode, message: res.message };
        }
    } catch (error) {
        return { status: 0, message: `오류가 발생했습니다.` };
    }

}

export const setCookie = (cookieName: string, value: any, expires: number = 0): void => {
    let date = new Date();
    date.setTime(date.getTime() + expires*1000);

    expires == 0
    ? document.cookie = cookieName + '=' + encodeURIComponent(value) + ';path=/'
    : document.cookie = cookieName + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/';
}


export async function uploadFileFetch(
  urlParams: string,               // 예: '/upload/single'
  file: File,                      // 업로드할 파일
  setParams?: Record<string, any>
) {
  const api = `${process.env.URL}${urlParams}`;     // 프로젝트에 맞게 조정
  const fd = new FormData();
    // 추가 파라미터들 추가
  if (setParams) {
    Object.entries(setParams).forEach(([key, value]) => {
      fd.append(key, String(value));  // value는 문자열이어야 함
    });
  fd.append('file', file);                          // Nest: FileInterceptor('file')와 일치
  }
  // console.log(fd)
//   const headers = buildAuthHeader(urlParams);
  
  const res = await fetch(api, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      // 'Content-Type' 넣지 말 것!
      Accept: 'application/json',
    //   ...headers,
    },
    body: fd,
  });

  // JSON 응답을 가정
  const data = await (async () => {
    try { return await res.json(); } catch { return await res.text(); }
  })();
  if (!res.ok) {
    let response ={
        ok: false,
        message: typeof data === 'string'
            ? data
            : (data?.message ?? 'Upload failed')
        
    }
    if(res.status === 400)
    {
      response.message = "이미지 파일만 업로드"
    }
    return response
  }
  return data; // { ok: true, savedPath: '...', ... } 같은 형태 기대
}


export const parseFilenameFromContentDisposition = (cd: string): string | null => {
  const mStar = cd.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (mStar?.[1]) {
    try {
      return decodeURIComponent(mStar[1].replace(/["']/g, '').trim());
    } catch {
      return mStar[1].trim();
    }
  }

  // filename="..."
  const m = cd.match(/filename\s*=\s*("?)([^";]+)\1/i);
  if (m?.[2]) return m[2].trim();

  return null;
}

export const downFileFetch = async (urlParams: string, setParams?: object, accesstoken:string = '') => {
  const api = `${process.env.URL}${urlParams}`;     // 프로젝트에 맞게 조정
  let headers:any =  {
    'Content-Type': 'application/json;charset=utf-8',
    Accept: 'application/json',
  }

  if (accesstoken != '') {
    headers = {
      ...headers,
      Authorization: `Bearer ${accesstoken}`
    }
  }

  const res = await fetch(api, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers:headers,
    body: JSON.stringify(setParams),
  });
  // console.log(res)


  if (!res.ok) {
    let errText = await res.text();
    popup('파일이 존재하지 않습니다.');
    throw new Error(errText || `Download failed (${res.status})`);
  }

  console.log('res.headers', res.headers)

  const cd = res.headers.get('content-disposition') ?? '';
  const filename = parseFilenameFromContentDisposition(cd) ?? `receipt`;

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(objectUrl);
  
}

export const koreaDateFormat = (dateString: string | Date) => {
    const utcDate = new Date(dateString);

    const year = utcDate.getFullYear();
    const month = utcDate.getMonth() + 1;
    const date = utcDate.getDate();

    const localDateString = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return localDateString;
}

export const getCookie = (cookieName: string): string => {
    let name: string;
    let data: string;
    let cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        name = cookies[i].substring(0, cookies[i].indexOf('='));
        data = cookies[i].substring(cookies[i].indexOf('=') + 1);
        name = name.replace(/^\s+|\s+$/g, '');
        if (name == cookieName) {
            return decodeURIComponent(data);
        }
    }
    
    return ''
}

export const nowMin = (setWeek: number = 30) => {
    let nowDate = new Date();
    let weekAgo = new Date(nowDate.getTime() - setWeek * 24 * 60 * 60 * 1000);
    weekAgo.setHours(0, 0, 0, 0);
    return weekAgo;
}

export const nowMax = () => {
    let now = new Date();
    now.setHours(23, 59, 59, 0);
    return now;
}

export const getHashCode = async (str: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const normalizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
}


export const naverLogin = async (action: string, userType?: SignupType) => {
  popup("준비중입니다.")
  return
  // let socialNaverUrl = `${process.env.URL}${ApiPath.SOCIAL_NAVER}`
  // if (userType) {
  //   socialNaverUrl += `/${userType}`
  // }
  // socialNaverUrl += `/${action}`
  // location.href = socialNaverUrl
}

export const getAccessToken = async (path: string) => {

  const key = await createKey()

  const accessToken = await encrypt(key, JSON.stringify({
    uri: path,
    timestamp: new Date().toISOString()
  }));


  return accessToken

}

export const deleteCookie = (cookieName: string): void => {
	document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

