export const isTokenValid = (expiresAt) => {
  if (!expiresAt) return false;
  return new Date() < new Date(expiresAt);
};
