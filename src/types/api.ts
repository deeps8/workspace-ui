type APIresponse<T> = {
  message: string;
  ok: boolean;
  data: T | null;
};

export type { APIresponse };
