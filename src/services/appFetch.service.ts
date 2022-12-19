interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: object;
}

interface ApiResponse<T = any> {
  status: number;
  mensagem: string;
  data: T;
}

const appFetch = async (
  url: string,
  options?: FetchOptions
): Promise<ApiResponse> => {
  const token = localStorage.getItem("JWT_TOKEN");
  const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    body: JSON.stringify(options?.body),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const corpo: ApiResponse = await response.json();

  if (corpo.status >= 200 && corpo.status < 300) {
    return corpo;
  }

  throw new Error(corpo.mensagem);
};

export default appFetch;
