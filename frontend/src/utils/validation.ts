export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password Validation: min 6, at least 1 uppercase, 1 digit, 1 symbol
export function isValidPassword(pw: string) {
  if (!pw || pw.length < 6) return false;
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+\\\/\[\];'`~]/.test(pw);
  return hasUpper && hasNumber && hasSymbol;
}
