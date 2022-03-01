import React, { useState } from 'react';
import { CardItem, View } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
import AccordionHeader from './AccordionHeader';

export default function Accordion({ dataArray }) {
  const [expanded, setExpanded] = useState(-1);

  return (
    <View style={style.outerView}>
      {dataArray.map((item, index) => (
        <View style={style.innerView} key={item.title}>
          <AccordionHeader
            title={item.title}
            direction={expanded === index ? 'up' : 'down'}
            onPress={() => setExpanded(expanded === index ? -1 : index)}
          />
          {expanded === index && (
            <CardItem style={style.cardItem}>{item.content}</CardItem>
          )}
        </View>
      ))}
    </View>
  );
}

Accordion.propTypes = {
  dataArray: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.element,
    }),
  ).isRequired,
};

const style = EStyleSheet.create({
  outerView: {
    paddingHorizontal: rem(30),
    paddingVertical: rem(20),
  },

  innerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardItem: {
    borderTopWidth: rem(1),
    // wip compatibility
    borderTopColor: Colors.separator || '#EBEFF0',
  },
});
