import React from 'react';
import { Button } from 'native-base';
import {
  Modal,
  Text,
  Pressable,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Portal } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useStore } from '../../hooks';
import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import { Screen } from '../Screen/Screen';

/**
 * @file Component to show modal taking the whole screen with blurred surrounding region.
 * The component Modal is declared together with the main Navigation structure {@link ../../navigations/Navigator} monitored by a mobx Observer component.
 * A store {@link ../../stores/containers/uiStore/containers/modalStore} is used to receive data from components and send any applicable response.
 */

const { height } = Dimensions.get('window');

export const RNModal = observer(() => {
  const store = useStore();

  const {
    type,
    visible,
    title,
    subtitle,
    description,
    name,
    image,
    component,
    cancelText,
    cancelCallback,
    confirmText,
    confirmCallback,
    inputCallback,
    enumerators
  } = store.uiStore.modalStore;

  const close = () => {
    store.uiStore.modalStore.hide();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Screen unsafe backgroundColor="transparent">
          <View
            style={style.root}
            onStartShouldSetResponder={() => Keyboard.dismiss()}
          >
            <View
              style={style.modalView}
              onStartShouldSetResponder={() => false}
            >
              {/* Upper right corner icon "x" for closing, only on alert modal */}
              {type === 'alert' && (
                <Pressable
                  style={[style.closeIcon]}
                  onPress={() => {
                    close();
                  }}
                >
                  <Ionicons name="close" size={12} color={Colors.label} />
                </Pressable>
              )}
              <View>
                {/* Title receives default value from store; all others are exhibited only when populated */}
                <Text style={style.title}>{title}</Text>
                {subtitle && <Text style={style.subtitle}>{subtitle}</Text>}
                {description && (
                  <Text style={style.description}>{description}</Text>
                )}
                {name && (
                  <Text style={style.name}>{name}</Text>
                )}
                {enumerators && enumerators.map((text, i) => (
                  <Text key={i} style={style.enumerator}>{text}</Text>
                ))}
              </View>
              {image && <View style={style.imageView}>{image()}</View>}
              {component && <View><Text style={style.subtitle}>Qual a sua avaliação?</Text></View>}
              {component && <View><Text style={style.description}>Escolha de 1 a 5 estrelas</Text></View>}
              {component && <View>{component()}</View>}
              {/* For input modal, closing function sent via callback to caller component */}
              {type === 'input' && inputCallback(() => close())}

              {/* Prompt modals show two buttons, the first only closing the modal and the second receiving a confirmation callback function. */}
              {type === 'prompt' && (
                <View style={style.buttons}>
                  <Button
                    style={[style.button, style.backButton]}
                    onPress={() => {
                      close();
                      cancelCallback();
                    }}
                  >
                    <Text style={[style.buttonText, style.backText]}>
                      {cancelText || 'Voltar'}
                    </Text>
                  </Button>
                  <Button
                    style={[style.button, style.confirmButton]}
                    onPress={() => {
                      close();
                      confirmCallback(true);
                    }}
                  >
                    <Text style={[style.buttonText, style.confirmText]}>
                      {confirmText || 'Confirmar'}
                    </Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        </Screen>
      </Modal>
    </Portal>
  );
});

const style = EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    maxWidth: '85%',
    backgroundColor: 'white',
    borderRadius: rem(10),
    paddingVertical: rem(30),
    paddingHorizontal: rem(25),
  },

  closeIcon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    padding: rem(20),
    zIndex: 1,
  },

  title: {
    color: Colors.black3,
    fontSize: rem(24),
    fontFamily: 'OpenSans_bold',
    textAlign: 'center',
  },

  subtitle: {
    color: Colors.grey2,
    fontSize: rem(18),
    textAlign: 'center',
    lineHeight: rem(27),
    paddingTop: rem(20),
    fontFamily: 'OpenSans_regular',
  },

  description: {
    color: '#65696B',
    fontSize: rem(12),
    textAlign: 'center',
    paddingTop: rem(20),
    fontFamily: 'OpenSans_regular',
  },

  name: {
    color: '#65696B',
    fontSize: rem(16),
    textAlign: 'center',
    paddingTop: rem(20),
    fontFamily: 'OpenSans_regular',
  },

  enumerator: {
    color: '#65696B',
    fontSize: rem(16),
    textAlign: 'left',
    paddingTop: rem(20),
    fontFamily: 'OpenSans_regular',
  },

  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: height * 0.7,
  },

  image: {
    aspectRatio: 1,
    width: '100%',
    height: 'auto',
    maxHeight: '90%',
    marginTop: rem(10),
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rem(30),
  },

  button: {
    borderRadius: rem(5),
    width: '47%',
    height: rem(40),
    justifyContent: 'center',
  },

  backButton: {
    backgroundColor: 'white',
    borderColor: Colors.blue1,
    borderWidth: rem(1),
  },

  buttonText: {
    fontSize: rem(14),
    fontFamily: 'OpenSans_regular',
  },

  backText: {
    color: Colors.blue1,
  },

  confirmButton: {
    backgroundColor: Colors.blue1,
  },

  confirmText: {
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },
});

export default RNModal;
