// Toast.js
import Toast from 'react-native-toast-message';

const showToast = (type, text1, text2) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};

const successToast = (text1, text2) => {
  showToast('success', text1, text2);
};

const errorToast = (text1, text2) => {
  showToast('error', text1, text2);
};

export { successToast, errorToast };