import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TextInput } from 'react-native';
import { Button, Text, View } from 'native-base';
import PropTypes from 'prop-types';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';

const TextAreaForm = ({ callback, closure }) => {
  const maxNumChars = 140;
  const [charsCount, setCharsCount] = useState(0);
  const charsCounter = (text) => {
    setCharsCount(Math.min(text.length, maxNumChars));
  };

  const textAreaStyle = () => {
    if (charsCount >= 140) {
      return {
        ...style.textArea,
        borderWidth: rem(2),
        borderColor: Colors.danger,
      };
    }

    return style.textArea;
  };

  return (
    <Formik
      initialValues={{ comments: '' }}
      onSubmit={(values, actions) => {
        callback(values.comments);
        actions.setSubmitting(false);
        closure();
      }}
      validationSchema={Yup.object().shape({
        comments: Yup.string().max(maxNumChars),
      })}
    >
      {({ handleSubmit, setFieldValue, handleBlur }) => (
        <View style={style.container}>
          <View style={style.header}>
            <Text style={style.label}>Comentários (opcional)</Text>
            <Text style={style.label}>
              {charsCount}/{maxNumChars}
            </Text>
          </View>
          <TextInput
            multiline
            maxLength={maxNumChars}
            name="comments"
            style={textAreaStyle()}
            onChangeText={(text) => {
              charsCounter(text);
              setFieldValue('comments', text);
            }}
            onBlur={handleBlur('comments')}
          />
          <View style={style.buttons}>
            <Button style={style.skipButton} onPress={closure}>
              <Text uppercase={false} style={style.skipText}>
                Cancelar
              </Text>
            </Button>
            <Button style={style.sendButton} onPress={handleSubmit}>
              <Text uppercase={false} style={style.sendText}>
                Enviar
              </Text>
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

TextAreaForm.propTypes = {
  callback: PropTypes.func.isRequired,
  closure: PropTypes.func.isRequired,
};

const style = EStyleSheet.create({
  container: {
    paddingTop: rem(20),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: rem(5),
  },

  label: {
    fontSize: rem(12),
    color: Colors.grey2,
    fontFamily: 'OpenSans_regular',
  },

  textArea: {
    color: Colors.grey1,
    backgroundColor: Colors.grey10,
    fontSize: rem(16),
    borderRadius: rem(5),
    textAlignVertical: 'top',
    height: rem(120),
    padding: rem(5),
    fontFamily: 'OpenSans_regular',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rem(30),
  },

  skipButton: {
    backgroundColor: 'white',
    borderRadius: rem(5),
    borderColor: Colors.blue1,
    borderWidth: rem(1),
    width: '45%',
    height: rem(40),
    justifyContent: 'center',
  },

  skipText: {
    fontSize: rem(14),
    color: Colors.blue1,
    fontFamily: 'OpenSans_regular',
  },

  sendButton: {
    backgroundColor: Colors.blue1,
    borderRadius: rem(5),
    width: '45%',
    height: rem(40),
    justifyContent: 'center',
  },

  sendText: {
    fontSize: rem(14),
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },
});

export default TextAreaForm;
