
// data/constants/errors.constants.ts
export const Errors = {
  required: "This field is required",
  textMaxLength: "Must not exceed 150 characters.",
  descriptionMaxLength: "Must not exceed 256 characters.",
  acceptTerms: "You must accept the terms and conditions",
  requiredName: (fieldName:string) => `${fieldName} is required`,
  role: "Role is required",
  firstName: {
    required: "First name is required",
    min: "First name must be at least 2 characters",
    invalid: "First name can only contain alphabets",
  },
  lastName: {
    required: "Last name is required",
    min: "Last name must be at least 2 characters",
  },
  email:{
    required: "Email is required",
    invalid: "Enter a valid email address",
  },
  password:{
    required: "Password is required",
    min: "Password must be at least 8 characters",
    mismatch: "Passwords do not match"
  },
  otp: {
    required: "OTP must be 6 digits",
  },
  phoneNumber:{
    required:"Phone number is required",
    invalid:"Enter a valid 10 digit phone number",
    countryValidation: "Enter a valid phone number",
  },
};
