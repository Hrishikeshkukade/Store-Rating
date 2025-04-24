// Form validation utilities
export const validateName = (value: string): string | undefined => {
  if (!value) return 'Name is required';
  if (value.length < 20) return 'Name must be at least 20 characters';
  if (value.length > 60) return 'Name must be at most 60 characters';
  return undefined;
};

export const validateAddress = (value: string): string | undefined => {
  if (!value) return 'Address is required';
  if (value.length > 400) return 'Address must be at most 400 characters';
  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Invalid email format';
  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 16) return 'Password must be at most 16 characters';
  
  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
  
  if (!hasUppercase) return 'Password must include at least one uppercase letter';
  if (!hasSpecialChar) return 'Password must include at least one special character';
  
  return undefined;
};

export const validateRating = (value: number): string | undefined => {
  if (value < 1 || value > 5) return 'Rating must be between 1 and 5';
  return undefined;
};