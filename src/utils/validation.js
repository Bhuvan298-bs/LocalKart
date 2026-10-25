/**
 * Form field validation utilities for LocalKart
 */

export function validateRequired(value, fieldName = 'This field') {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return '';
}

export function validateEmail(email) {
  if (!email || email.trim() === '') {
    return 'Email address is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return '';
}

export function validatePhone(phone) {
  if (!phone || phone.trim() === '') {
    return 'Mobile number is required';
  }
  // Standard Indian 10-digit mobile number format
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return 'Please enter a valid 10-digit Indian phone number';
  }
  return '';
}

export function validatePositiveNumber(value, fieldName = 'Value') {
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a number greater than 0`;
  }
  return '';
}

export function validateNonNegativeNumber(value, fieldName = 'Value') {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    return `${fieldName} cannot be negative`;
  }
  return '';
}
