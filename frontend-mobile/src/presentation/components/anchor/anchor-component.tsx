import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from 'src/presentation/styles/global-styles';

const styles = {
    textDecoration: 'underline',
    textAlign: 'center',
    padding: 5,
    margin: 10,
    fontWeight: 'bold',
    color: GlobalStyles.colors.MediumDarkColor,
};

type AnchorProps = {
  name: string;
  redirectLink: string;
};

export const AnchorComponent: React.FC<AnchorProps> = ({ name, redirectLink }) => {
  const navigation = useNavigation();

  const onAnchorClick = () => {
    navigation.navigate((redirectLink as never));
    };

  return (
    <TouchableOpacity onPress={onAnchorClick} style={styles}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};
