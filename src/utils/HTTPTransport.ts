const METHODS = {
 GET: "GET",
 POST: "POST",
 PUT: "PUT",
 DELETE: "DELETE",
};

type Options = {
 method: string;
 data?: any;
 headers?: any;
 timeout: number;
};

const initialOptions: Options = {
 method: "",
 timeout: 5000,
};

function queryStringify(data: any) {
 if (typeof data !== "object") {
  throw new Error("Data must be object");
 }

 const keys = Object.keys(data);
 return keys.reduce((result, key, index) => {
  return `${result}${key}=${data[key]}${index < keys.length - 1 ? "&" : ""}`;
 }, "?");
}

class HTTPTransport {
 get = (url: string, options: Options = initialOptions) => {
  return this.request(url, {...options, method: METHODS.GET}, options.timeout);
 };

 post = (url: string, options: Options = initialOptions) => {
  return this.request(url, {...options, method: METHODS.POST}, options.timeout);
 };

 put = (url: string, options: Options = initialOptions) => {
  return this.request(url, {...options, method: METHODS.PUT}, options.timeout);
 };

 delete = (url: string, options: Options = initialOptions) => {
  return this.request(url, {...options, method: METHODS.DELETE}, options.timeout);
 };

 request = (url: string, options: Options = initialOptions, timeout = 5000) => {
  const {headers = {}, method, data} = options;

  return new Promise((resolve, reject) => {
   if (!method) {
    reject("No method");
    return;
   }

   const xhr = new XMLHttpRequest();
   const isGet = method === METHODS.GET;

   xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

   Object.keys(headers).forEach((key: string) => {
    xhr.setRequestHeader(key, headers[key]);
   });

   xhr.onload = () => {
    resolve(xhr);
   };

   xhr.onabort = reject;
   xhr.onerror = reject;

   xhr.timeout = timeout;
   xhr.ontimeout = reject;

   if (isGet || !data) {
    xhr.send();
   } else {
    xhr.send(data);
   }
  });
 };
}
