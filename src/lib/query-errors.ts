export class DirectoryUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectoryUnavailableError";
  }
}

export function isMissingRelationError(error: {
  code?: string;
  message?: string;
}) {
  const message = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /could not find the table/i.test(message) ||
    /schema cache/i.test(message) ||
    /does not exist/i.test(message)
  );
}

export function isMissingColumnError(error: {
  code?: string;
  message?: string;
}) {
  const message = error.message ?? "";
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    /phone_en|phone_es/i.test(message)
  );
}
