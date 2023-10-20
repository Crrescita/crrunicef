export const regx = {
  dob: /^(?:0[1-9]|[12]\d|3[01])([\/.-])(?:0[1-9]|1[0-2])\1(?:19|20)\d\d$/,
  email: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,})+$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  fullname: /^(?=.*[A-Za-z ])[A-Za-z ]{1,}$/,
  otp: /^(?=.*[0-9])[0-9]{6}$/,
  otpmy: /^(?=.*[0-9])[0-9]{4}$/,
  otpFour: /^(?=.*[0-9])[0-9]{4}$/,
  url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g,
  month: /^(0?[1-9]|1[012])$/,
  year: /(?:(?:20)[0-9]{2})/,
  cvv: /^[0-9]{3,4}$/,
  cardNumber: /^[0-9]{13,16}$/,
  phoneWithCountryCode:
    /^(?=.*[+])[+]{1}?([91]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{5})$/,
  phoneFirstThree: /^(?=.*[+])[+]{1}?([0-9]{2})$/,
  phoneLastTen: /^(?=.*[0-9])[0-9]{10}$/,
  adhaarcard: /^(?=.*[0-9])[0-9]{12}$/,
  htmlTags: /<\/?[^>]+(>|$)/g,
  pinCode: /^(?=.*[0-9])[0-9]{6}$/,
};

export const API_URL = {
  BASE_URL_DEV: "https://care.crrescita.com/api",


  LOGIN: '',
  SIGNUP: 'auth/signup',
  GET_OTP: '',
  VERIFY_OTP: 'auth/otp',
  GET_HOME_DATA: 'home/gethomedata'
}
