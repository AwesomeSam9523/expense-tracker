import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import icons from "../constants/icons"

const FormFeild = ({type, icon, value, placeholder, handlechangeText, otherStyles, ...props}) => {
  
    const [showPassword, setShowPassword] = useState(false)
  
    return (
    <View className=" my-2 w-full ">
      
      <View className="bg-secondary border-1 focus:border-white  p-3 h-20  w-full rounded-3xl items-center flex-row">
        <Image source={icon} className='h-7 w-7 mx-1' resizeMode='contain'/>
        
        <TextInput
            className="flex-1 px-3 text-primary text-xlg"
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#151515'
            selectionColor={'#151515'}
            onChangeText={handlechangeText}
            secureTextEntry={type==="Password" && !showPassword}
        />
                {
                  type==="Password" && (
                    
                    <TouchableOpacity
                    
                    onPress={()=>{
                      setShowPassword(!showPassword)
                    }}
                    >
                      <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-7 h-7 flex " resizeMode='contain'></Image>
                    </TouchableOpacity>
                  )
                
                }
      </View>
    </View>
  )
}

export default FormFeild