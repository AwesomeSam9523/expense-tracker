import SwitchToggle from "react-native-switch-toggle";

const containerStyle = {
  default: {
    width: 80, height: 40, borderRadius: 25, padding: 5, marginTop: 16,
  },
  small: {
    width: 45, height: 25, borderRadius: 15, padding: 3
  }
}

const circleStyle = {
  default: {
    width: 32, height: 32, borderRadius: 16
  },
  small: {
    width: 18, height: 18, borderRadius: 9
  }
}

const ToggleSwitch = ({handleToggle, toggle, size="default"}) => {

  return (

    <SwitchToggle
      switchOn={toggle}
      onPress={handleToggle}
      circleColorOff='#5B5B5B'
      circleColorOn='#ACD17D'
      backgroundColorOn='#4D4D4D'
      backgroundColorOff='#3A3A3A'
      containerStyle={containerStyle[size]}
      circleStyle={circleStyle[size]}
    />

  )
}

export default ToggleSwitch;
