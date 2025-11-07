export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  }
  export const json = (data: unknown, init: ResponseInit = {}) =>
    new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json' } });