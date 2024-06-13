import type {ComponentProps} from "react";
import {Link} from "expo-router";
import { TextInput } from 'react-native';

type Props = Omit<ComponentProps<typeof String>, 'label'> & { label: string };

export function BaseInput({ label, ...props }: Props) {
  return (
    <TextInput
      {...props}
      placeholder={label}
      style={{
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        margin: 5,
      }}
    />
  );
}
