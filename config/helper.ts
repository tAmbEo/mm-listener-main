import { HttpException } from '@nestjs/common';

const http = {
  'normal': require('http'),
  'ssl': require('https')
}

interface IHttpPost {
  host?: string;
  port: number;
  path: string;
  payload: any;
}

console.log(process.env.HOOK_API_DOMAIN)

export const httpPost = async (params: IHttpPost) => {
  const { host, port, path, payload } = params;
  const data = JSON.stringify(payload);
  const options = {
    hostname: host || process.env.HOOK_API_DOMAIN,
    port: port,
    path: path.replace('//', '/'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };
  return new Promise((rs, rj) => {
    const req = http[port == 443 ? 'ssl' : 'normal'].request(options, (res) => {
      res.on('data', (data) => rs(data.toString()));
    });
    req.on('error', (error) => rj(error));
    req.write(data);
    req.end();
  });
}