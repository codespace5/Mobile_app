import _ from 'lodash';

const required = value => (value !== undefined && value !== null && value !== ''
  ? undefined
  : 'Required');

const checkBoxValue = value => (value !== undefined && value !== null && value !== false ? undefined : 'Please check Terms and Condition');

const checkBoxUGCValue = value => (value !== undefined && value !== null && value !== false ? undefined : 'Please check UGC permission');

const validEmail = value => (!(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)));

const validUserName = value => (!(value && !/^[a-zA-Z0-9_-]{3,15}$/i.test(value)));
const UserNameOrEmail = value => (value && (validUserName(value) || validEmail(value)) ? undefined : 'Enter valid profile name or email');

const uName = value => (value && !/^[a-zA-Z0-9._-]{3,50}$/i.test(value)
  ? 'Invalid Profile Name'
  : undefined);

const OtpLength = value => (value && value.length > 4 ? 'Must be 4 characters' : undefined);
const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength30 = maxLength(30);
const maxLength8 = maxLength(8);
const maxLength6 = maxLength(6);
const maxLength100 = maxLength(100);
const maxLength251 = maxLength(251);
const maxLength18 = maxLength(18);
const maxLength14 = maxLength(14);
const maxLength60 = maxLength(60);
const minLength = min => value => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
const minLength2 = minLength(2);
const minLength6 = minLength(6);
const number = value => (value && (_.isNaN(Number(value)) || Number(value) < 0)
  ? 'Must be a positive number'
  : undefined);
const integer = value => (value && (!_.isInteger(Number(value)) || Number(value) < 0)
  ? 'Must be an integer'
  : undefined);
const minValue = min => value => (value && value < min ? `Must be at least ${min}` : undefined);
const minValue13 = minValue(13);
const email = value => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
  ? 'Invalid email address'
  : undefined);
const addSpace = value => (value && /^(.*\s+.*)+$/i.test(value) ? 'Space Not Allowed' : undefined);
const webSiteUrl = value => (value
  // eslint-disable-next-line no-useless-escape
  && !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i.test(
    value,
  )
  ? 'Invalid Website url'
  : undefined);
const tooYoung = value => (value && value < 13
  ? 'You do not meet the minimum age requirement!'
  : undefined);
const aol = value => (value && /.+@aol\.com/.test(value)
  ? 'Really? You still use AOL for your email?'
  : undefined);
const alphaNumeric = value => (value && /[^a-zA-Z0-9 ]/i.test(value)
  ? 'Only alphanumeric characters'
  : undefined);
const phoneNumber = value => (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
  ? 'Invalid phone number, must be 10 digits'
  : undefined);
const singleDropDown = obj => (!_.isObject(obj)
  || _.isEmpty(obj)
  || (obj.id === null
    || obj.id === undefined
    || obj.value === null
    || obj.value === undefined
    || obj.id === ''
    || obj.value === '')
  ? 'Please Select Category from Dropdown'
  : undefined);
const multiDropDown = obj => (_.isArray(obj) && obj.length > 0
  ? undefined
  : 'You Must check at least 1 option');
const allCheck = (min, obj) => (_.isArray(obj) && obj.length === min
  ? undefined
  : 'You Must check all options');

const minKp = (min, value) => (_.isNaN(parseFloat(value, 10)) || _.toNumber(value) <= min
  ? `Must be greater than ${min}`
  : undefined);

const geoLocation = value => (!_.isObject(value)
  || !_.toNumber(value.latitude)
  || !_.toNumber(value.longitude)
  ? 'Geo-location can not be blank'
  : undefined);
const maxVal = (max, value) => (_.isNaN(parseFloat(value, 10)) || _.toNumber(value) > max
  ? `Must be less than ${max}`
  : undefined);
const minVal = (min, value) => (_.isNaN(parseFloat(value, 10)) || _.toNumber(value) < min
  ? `Must be greater than ${min}`
  : undefined);

const categoryRequired = obj => (_.isArray(obj) && obj.length > 0
  ? undefined
  : 'You Must select at least 1 category');

const businessTypeVal = obj => (_.isObject(obj) && !_.isEmpty(obj)
  ? undefined
  : 'Please select your business Type.');

const adDescriptionVal = obj => (_.isString(obj) && obj.length > 1000
  ? 'Maximum 1000 character Allow'
  : undefined);

const numberAutocomplete = (obj) => {
  if (
    !_.isObject(obj)
    || _.isEmpty(obj)
    || (obj.id === null
      || obj.id === undefined
      || obj.value === null
      || obj.value === undefined
      || obj.id === ''
      || obj.value === '')
  ) {
    return 'This Field is Required';
  } if (!_.isInteger(Number(obj.value)) || Number(obj.value) < 0) {
    return 'Must be an integer';
  }
  return undefined;
};

const drumNumber = obj => (!_.isObject(obj)
  || _.isEmpty(obj)
  || (obj.id === null
    || obj.id === undefined
    || obj.value === null
    || obj.value === undefined
    || obj.id === ''
    || obj.value === '')
  ? 'Please enter Drum Number'
  : undefined);

const matchPasswords = pass1 => pass2 => (pass1 !== pass2 ? 'Passwords don\'t match' : undefined);

function isClient(userData) {
  return _.isObject(userData) && userData.type === 'Client';
}
export {
  required,
  addSpace,
  maxLength,
  maxLength30,
  maxLength8,
  minLength,
  minLength2,
  number,
  minValue,
  minValue13,
  email,
  tooYoung,
  aol,
  alphaNumeric,
  phoneNumber,
  integer,
  singleDropDown,
  allCheck,
  multiDropDown,
  minKp,
  minVal,
  maxVal,
  // maxKp,
  geoLocation,
  numberAutocomplete,
  drumNumber,
  isClient,
  maxLength100,
  maxLength18,
  maxLength14,
  maxLength60,
  webSiteUrl,
  categoryRequired,
  businessTypeVal,
  adDescriptionVal,
  matchPasswords,
  maxLength6,
  OtpLength,
  minLength6,
  UserNameOrEmail,
  uName,
  checkBoxValue,
  maxLength251,
  checkBoxUGCValue,
};
