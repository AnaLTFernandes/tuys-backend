export type ErrorType = {
  name: string;
};

function notFoundError(): ErrorType {
  return {
    name: "NotFound",
  };
}

function badRequestError(): ErrorType {
  return {
    name: "BadRequest",
  };
}

function unauthorizedError(): ErrorType {
  return {
    name: "Unauthorized",
  };
}

function conflictError(): ErrorType {
  return {
    name: "Conflict",
  };
}

function signUpError(): ErrorType {
  return {
    name: "SignUp",
  };
}

export { notFoundError, badRequestError, unauthorizedError, conflictError, signUpError };
