export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  OPERATIONS_MANAGER: "Operations Manager",
  MENTOR: "Mentor",
  STUDENT: "Student",
  PARENT: "Parent",
  RECRUITER: "Recruiter",
  GUEST: "Guest",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access. Please provide a valid token.",
  FORBIDDEN: "Forbidden. You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource could not be found.",
  INTERNAL_ERROR: "An unexpected internal server error occurred.",
  VALIDATION_ERROR: "Validation failed. Please check your inputs.",
};
