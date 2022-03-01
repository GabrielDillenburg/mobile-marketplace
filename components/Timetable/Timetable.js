import React, { useEffect, useState } from 'react';
import { View } from 'native-base';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import { TouchableOpacity } from 'react-native';
import Text from '../Text/Text';
import rem from '../../utils/rem';
import Colors from '../../constants/Colors';

/**
 *
 * @returns timetable component
 */

export default function Timetable({ timeList, classData }) {
  const [chosenButton, setChosenButton] = useState(null);

  const createKey = (id, time) => `${id}#${time}`;
  const parseKey = (key) => (key == null ? [null, null] : key.split('#'));

  useEffect(() => {
    const [id, time] = parseKey(chosenButton);
    classData.setClassTimeId(id);
    classData.setClassTime(time);
  }, [chosenButton, classData]);

  return (
    <View style={style.wrapper}>
      {timeList.map((item) => {
        const key = createKey(item.id, item.time);
        return (
          <View
            key={key}
            style={style.button}
            backgroundColor={chosenButton === key ? Colors.blue1 : 'white'}
          >
            <TouchableOpacity
              style={style.touchable}
              onPress={() => {
                setChosenButton(chosenButton === key ? null : key);
              }}
            >
              <Text
                fontSize={14}
                color={chosenButton === key ? 'white' : Colors.blue1}
              >
                {item.time}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

Timetable.propTypes = {
  classData: PropTypes.shape({
    setClassTimeId: PropTypes.func,
    setClassTime: PropTypes.func,
  }).isRequired,
  timeList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      time: PropTypes.string,
    }),
  ).isRequired,
};

const style = EStyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: rem(-9),
  },

  button: {
    borderColor: Colors.blue1,
    borderRadius: rem(4),
    borderWidth: rem(1),
    margin: rem(8),
  },

  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    height: rem(40),
    width: rem(65),
  },
});
