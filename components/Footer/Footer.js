import React from 'react';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Footer, FooterTab, Button, Icon } from 'native-base';
import Text from '../Text/Text';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';

const NBFooter = () => {
  const navigation = useNavigation();

  return (
    <Footer style={style.footerWrapper}>
      <FooterTab style={style.footerTab}>
        <Button
          style={style.footerButton}
          vertical
          onPress={() => {
            navigation.navigate('Explore');
          }}
        >
          <Icon name="apps" />
          <Text>Explorar</Text>
        </Button>
        <Button
          vertical
          onPress={() => {
            navigation.navigate('StudentMyClasses');
          }}
        >
          <Icon name="camera" />
          <Text>Minhas aulas</Text>
        </Button>
        <Button
          vertical
          onPress={() => {
            navigation.navigate('StudentProfile');
          }}
        >
          <Icon active name="navigate" />
          <Text>Perfil</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
};

const style = EStyleSheet.create({
  footerWrapper: {
    height: rem(65),
  },
  footerTab: {
    backgroundColor: Colors.white,
  },
  footerButton: {},
});

NBFooter.defaultProps = {};

NBFooter.propTypes = {};

export default NBFooter;
