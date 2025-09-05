type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

function generateError(message: string, code: number) {
    return {message: message, code: code}
}

export async function tryCatchAPI<T, E = Error>(
  promise: Promise<any>
): Promise<Result<object | null, object | null>> {
    const { data, error }: Awaited<Result<Response | null, Error | null>> = await tryCatch(promise);
    if (!data || error) return { data: null, error: error };

    if (
      data.headers.get("content-length") &&
      Number(data.headers.get("content-length")) == 0
    ) {
      return {
        data: null,
        error: generateError("Not Found", 404),
      };
    }

    try {
        const body: Awaited<any> = await data.json();
        if (body.code != 0) {
            return {
                data: null,
                error: generateError("Anixart API Error", body.code),
            };
        }
        return {
            data: body,
            error: null,
        };
    } catch {
        return { data: null, error: generateError("failed to parse json", 500) }
    }

    return { data: null, error: generateError("tryCatch.ts: unreachable", 500) }
}