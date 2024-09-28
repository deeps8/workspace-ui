type APIresponse<T> = {
  message: string;
  ok: boolean;
  data: T;
};

export type { APIresponse };
