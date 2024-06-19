import SwitchToggle from "react-native-switch-toggle";

const ToggleSwitch = ({handleToggle, toggle}) => {

  return (

    <SwitchToggle
      switchOn={toggle}
      onPress={handleToggle}
      circleColorOff='#5B5B5B'
      circleColorOn='#ACD17D'
      backgroundColorOn='#4D4D4D'
      backgroundColorOff='#3A3A3A'
    />

  )
}

export default ToggleSwitch;
