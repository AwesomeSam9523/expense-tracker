import React from 'react';
import {Image} from 'react-native';
import CheckBox from 'react-native-check-box';
import icons from "../constants/icons";

const CustomCheckBox = ({size = 20, isChecked, setIsChecked}) => {
  return (
    <CheckBox
      onClick={() => {
        setIsChecked(!isChecked);
      }}
      isChecked={isChecked}
      checkedImage={<Image source={icons.checked} style={{width: size, height: size}}/>}
      unCheckedImage={<Image source={icons.unchecked} style={{width: size, height: size}}/>}
    />
  );
};


export default CustomCheckBox;
