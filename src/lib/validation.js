import { STORE_CONFIG } from '../config/store.js';
import { isValidPakistaniPhone, normalizePakistaniPhone } from './phone.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_REGEX = /^\d{5}$/;

export function validateCheckoutField(name, rawValue) {
  const value = typeof rawValue === 'string' ? rawValue.trim() : '';

  switch (name) {
    case 'fullName': {
      if (!value) return 'Full name is required.';
      if (value.length < 3) return 'Please enter at least 3 characters.';
      return '';
    }
    case 'phone': {
      if (!value) return 'Mobile number is required for delivery updates.';
      if (!isValidPakistaniPhone(value)) {
        return 'Enter a valid Pakistani mobile number (e.g. 0300 1234567).';
      }
      return '';
    }
    case 'email': {
      if (!value) return '';
      if (!EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address or leave this field blank.';
      }
      return '';
    }
    case 'streetAddress': {
      if (!value) return 'Street address is required.';
      if (value.length < 10) {
        return 'Please include house/flat number, street, and sector or area (min 10 chars).';
      }
      return '';
    }
    case 'city': {
      if (!value) return 'Please select your delivery city.';
      if (!STORE_CONFIG.CITIES.includes(value)) {
        return 'Please choose a supported city from the list.';
      }
      return '';
    }
    case 'postalCode': {
      if (!value) return 'Postal code is required.';
      if (!POSTAL_REGEX.test(value)) {
        return 'Enter a valid 5-digit Pakistani postal code (e.g. 54000).';
      }
      return '';
    }
    default:
      return '';
  }
}

export function sanitizeCheckoutValues(values) {
  const trimmedName = (values.fullName || '').trim();
  const normalizedPhone = normalizePakistaniPhone(values.phone || '') || (values.phone || '').trim();
  const trimmedEmail = (values.email || '').trim();
  const trimmedStreet = (values.streetAddress || '').trim();
  const trimmedCity = (values.city || '').trim();
  const trimmedPostal = (values.postalCode || '').trim();

  return {
    fullName: trimmedName,
    phone: normalizedPhone,
    email: trimmedEmail,
    streetAddress: trimmedStreet,
    city: trimmedCity,
    postalCode: trimmedPostal,
    paymentMethod: values.paymentMethod === 'bank' ? 'bank' : 'cod',
  };
}

export function validateCheckoutForm(values) {
  const fields = ['fullName', 'phone', 'email', 'streetAddress', 'city', 'postalCode'];
  const errors = {};
  let firstErrorField = null;

  for (const field of fields) {
    const error = validateCheckoutField(field, values[field]);
    if (error) {
      errors[field] = error;
      if (!firstErrorField) {
        firstErrorField = field;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstErrorField,
  };
}
