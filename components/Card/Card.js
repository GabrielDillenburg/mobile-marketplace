import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, View, Pressable, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Card, Text, Col, Grid, Button, Icon } from 'native-base';
import { ActivityIndicator, IconButton, Menu } from 'react-native-paper';
import EStyleSheet from 'react-native-extended-stylesheet';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Toast from 'react-native-toast-message';
import { flowResult } from 'mobx';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
import { useStore } from '../../hooks';
import TextAreaForm from './InputComponent';
import Avatar from '../Avatar/Avatar';
import InDoubt from '../Svg/InDoubt';
import Hooray from '../Svg/Hooray';

/**
 * @file Card showing information about class and teacher.
 * May have a context menu firing modals {@link ../Modal/Modal} to inform absence or cancel class. Data sent through store {@link ../../stores/containers/uiStore}.
 * The whole card, except for specific regions, is a link to the class details screen {@link ../../screens/StudentClassDetails}
 */

const { width } = Dimensions.get('window');

const NBCard = observer((props) => {
  const { classData, isAssigned = false } = props;
  const navigation = useNavigation();
  const store = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [averange, setAverange] = useState({});

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const checkinOrAbsence = async (comments) => {
    const res = await flowResult(
      classData.checkinOrAbsence({ status: false, comments }),
    );

    if (res) {
      await flowResult(store.classDataStore.fetchOccurrences(1));
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
      });
    }
  };

  const inputCallbackAbsense = (closure) => (
    <TextAreaForm callback={checkinOrAbsence} closure={closure} />
  );

  const absentStudentModal = () => {
    store.uiStore.modal({
      type: 'input',
      title: 'Você tem certeza?',
      subtitle: 'Lembre-se de conversar com seu professor e repor esta aula.',
      description:
        'Se você informar a ausência até 12 horas antes da aula, você não será cobrado(a) na mensalidade.',
      inputCallback: inputCallbackAbsense,
    });
  };

  /** Functions used by @param inputCommentModal */
  const responseCallback = (response) => {
    classData.setCancelReason(response);
  };

  const inputCallback = (closure) => (
    /** Basic form with a TextInput as TextArea {@link ./InputComponent} */
    /** @param closure informed by Modal {@link ../Modal/Modal} */
    <TextAreaForm
      callback={responseCallback}
      closure={async () => {
        const { id: classId, teacher: { profile: { id: teacherId } } } = classData;
        const studentId = store?.studentStore?.student?.id

        const cancel = await flowResult(store.classDataStore.cancelOccurence(studentId, teacherId, classId));

        if (cancel) {
          console.log('cancel', cancel);
          return;
        }

        const res = await flowResult(classData.unassignStudent());

        if (res) {
          await flowResult(store.classDataStore.fetchOccurrences(1));
          Toast.show({
            type: 'success',
            text1: 'Aula cancelada com sucesso!',
          });
        }

        closure();
      }}
    />
  );

  const inputCommentModal = () => {
    store.uiStore.modal({
      type: 'input',
      title: 'Aula cancelada!',
      subtitle: 'Quer comentar algo com o seu professor?',
      inputCallback,
      cancelText: 'Não enviar',
    });
  };

  /** Upon confirmation, triggers second modal to get user response. */
  const classCancelingModal = () => {
    store.uiStore.modal({
      type: 'prompt',
      title: 'Você tem certeza?',
      subtitle: 'O cancelamento de todas as aulas afetará sua agenda.',
      image: () => <InDoubt />,
      confirmText: 'Sim',
      confirmCallback: inputCommentModal,
    });
  };

  const checkinModal = () => {
    store.uiStore.modal({
      type: 'alert',
      title: 'Ebaaa!',
      subtitle: 'Sua presença foi confirmada com sucesso!',
      description: 'Tenha uma excelente aula!',
      image: () => <Hooray />,
    });
  };


  /* Implements business rule to make presence confirmation button visible at most 24 hours prior to the class and 30 minutes after it's start. */
  const buttonVisibleNow = () => {
    // Required replacement to make datetime understandable inside React as ISO.
    let targetDate = new Date(classData.datetime.replace(' ', 'T'));

    // Required workaround to adjust time by timezone to perform correct operations.
    targetDate = new Date(
      targetDate.setMinutes(
        targetDate.getMinutes() + targetDate.getTimezoneOffset(),
      ),
    );

    // Difference set in minutes.
    const diff = (targetDate - new Date()) / (1000 * 60);

    // Validation: 30 minutes after or 24 hours before.
    return diff > -30 && diff / 60 < 24;
  };

  const imageSource = useMemo(
    () =>
      classData.images?.length > 0 ? { uri: classData.images[0].url } : null,
    [classData.images],
  );

  const init = async () => {
    let res = await flowResult(store.classDataStore.fetchRating(classData?.teacher.profile?.id));
    setAverange(res)
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Pressable
      onPress={() =>
        !classData.occurrenceCancelled &&
        navigation.navigate('StudentClassDetails', { classData, isAssigned })
      }
      disabled={classData.occurrenceCancelled}
    >
      <Card style={style.classCard}>
        <View style={style.imageWrapper}>
          <Image source={imageSource} style={style.cardPicture} />
          <Grid style={style.headerGrid}>
            <Col style={style.headerAverange} >
              <Text style={style.headerTitle}>
                <Icon
                  type="MaterialIcons"
                  name="star-rate"
                  style={style.headerIcon}
                />
                {`${averange.ratingAvg ? Number(averange.ratingAvg).toFixed(1) : '-'} (${averange.count || '-'})`}</Text>
            </Col>
            <Col style={style.headerValue} >
              {
                // isAssigned ? 
                (
                  <Text style={style.headerTitle}>R$ {Number(classData.value || 1).toFixed(2).replace('.', ',')} / Aula</Text>
                )
                //  : (
                //   <Text style={style.headerTitle}>R$ {Number(classData.estimatedValue || 1).toFixed(2).replace('.', ',')} / Mês</Text>
                // )
              }

            </Col>
          </Grid>
          <Grid style={style.titleGrid}>
            <Col style={style.teacherPictureColumn} />
            <Col>
              <Text style={style.title}>{classData.title.length <= 17 ? classData.title : classData.title.substring(0, 17) + '...'}</Text>
            </Col>
          </Grid>
        </View>

        <Grid style={style.grid}>
          <Col style={style.teacherPictureColumn}>
            <Avatar
              source={classData?.teacher?.profile?.image?.url}
              style={style.teacherPicture}
              size={64}
            />
          </Col>
          <Col>
            <Text
              style={style.name}
            >{`${classData.teacher.profile.name} ${classData.teacher.profile.last_name.substring(0, 1)}.`}</Text>
          </Col>
          <Col style={style.menuColumn}>
            {/* When enrolled in the class shown in the card, the student can see a context menu to cancel the class or inform absence, if possible. */}
            {classData.classOccurrenceId != null &&
              !classData.occurrenceCancelled ? (
              <Menu
                contentStyle={style.menuArea}
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <IconButton
                    style={style.menuIcon}
                    icon="dots-vertical"
                    color={Colors.grey1}
                    size={20}
                    onPress={openMenu}
                  />
                }
              >
                <Menu.Item
                  style={[style.menuButton, style.topMenuButton]}
                  onPress={() => {
                    closeMenu();
                    absentStudentModal();
                  }}
                  title="Informar ausência"
                  titleStyle={style.menuTitle}
                />
                <Menu.Item
                  style={[style.menuButton, style.bottomMenuButton]}
                  onPress={() => {
                    closeMenu();
                    classCancelingModal();
                  }}
                  title="Cancelar aulas"
                  titleStyle={style.menuTitle}
                />
              </Menu>
            ) : null}
          </Col>
        </Grid>
        <View style={style.ageAndLocationArea}>
          <Text style={style.ageAndLocation}>
            {classData.isOnline ? 'Online' : 'Presencial'}
            {classData.ageGroup && ` · ${classData.ageGroup}`}
          </Text>
        </View>

        {/* Shows button only when required and within time frame */}
        {classData.classOccurrenceId &&
          !classData.occurrenceCancelled &&
          !classData.checkedIn &&
          buttonVisibleNow() ? (
          <Button
            style={[style.bottomButton, style.actionButton]}
            onPress={async () => {
              setIsLoading(true);
              const res = await classData.checkinOrAbsence({ status: true });
              setIsLoading(false);
              if (res) {
                checkinModal();
                await flowResult(store.classDataStore.fetchOccurrences(1));
              }
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text uppercase={false} style={style.buttonText}>
                Confirmar presença
              </Text>
            )}
          </Button>
        ) : null}

        {classData.occurrenceCancelled && (
          <>
            <View style={[EStyleSheet.absoluteFill, style.blurrer]} />
            <Button
              disabled
              style={[style.bottomButton, style.informationButton]}
            >
              <Text uppercase={false} style={style.buttonText}>
                Professor informou ausência
              </Text>
            </Button>
          </>
        )}
      </Card>
    </Pressable>
  );
});

NBCard.propTypes = {
  classData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
    ageGroup: PropTypes.string,
    teacher: PropTypes.shape({
      name: PropTypes.string,
      introduction: PropTypes.string,
      picture: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    student: PropTypes.shape({
      isEnrolled: PropTypes.bool,
    }),
  }).isRequired,
};

export default NBCard;

const style = EStyleSheet.create({
  classCard: {
    borderRadius: rem(10),
    overflow: 'hidden',
  },

  blurrer: {
    backgroundColor: Colors.black1,
    opacity: 0.3,
  },

  imageWrapper: {
    minHeight: rem(150),
    paddingTop: rem(8),
    paddingBottom: rem(2),
  },

  cardPicture: {
    ...StyleSheet.absoluteFillObject,
    maxHeight: rem(130),
    borderTopLeftRadius: rem(10),
    borderTopRightRadius: rem(10),
    backgroundColor: Colors.grey2,
    position: 'absolute',
  },

  titleGrid: {
    alignItems: 'flex-end',
    top: rem(-20),
  },

  headerGrid: {
    alignItems: 'flex-end',
    top: rem(-40),
  },

  headerIcon: {
    alignItems: 'center',
    marginRight: rem(12),
    fontSize: rem(14),
    color: '#ffb600'
  },

  headerTitle: {
    fontSize: rem(14),
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  headerValue: {
    left: rem(50),
    right: rem(20),
  },

  headerAverange: {
    left: rem(20),
    right: rem(80),
  },

  title: {
    fontSize: rem(24),
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  grid: {
    width: width - rem(65),
    marginTop: rem(-23),
    height: rem(50),
  },

  teacherPictureColumn: {
    width: rem(100),
  },

  teacherPicture: {
    borderColor: Colors.grey8,
    borderWidth: rem(3),
    top: rem(-30),
    left: rem(20),
    backgroundColor: Colors.grey8,
  },

  name: {
    fontSize: rem(16),
    color: Colors.grey1,
    fontFamily: 'OpenSans_semibold',
    paddingVertical: rem(5),
  },

  ageAndLocationArea: {
    height: rem(43),
    width: width - rem(100),
    marginTop: rem(5),
    marginBottom: rem(25),
    borderRadius: rem(20),
    backgroundColor: Colors.grey9,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ageAndLocation: {
    fontSize: rem(16),
    color: Colors.grey2,
    fontFamily: 'OpenSans_regular',
  },

  menuColumn: {
    width: rem(45),
  },

  menu: {
    fontSize: rem(18),
    color: Colors.grey1,
    padding: rem(10),
    fontFamily: 'OpenSans_regular',
  },

  bottomButton: {
    borderRadius: rem(10),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: width - rem(65),
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButton: {
    backgroundColor: Colors.blue1,
  },

  informationButton: {
    backgroundColor: Colors.grey11,
  },

  buttonText: {
    fontSize: rem(16),
    color: Colors.white,
    fontFamily: 'OpenSans_bold',
  },

  menuArea: {
    height: rem(100),
    marginTop: rem(40),
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuIcon: {
    zIndex: 1,
  },

  menuButton: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    // padding: rem(20),  // FIX iOS BUG
    width: rem(200),
  },

  topMenuButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: rem(1),
    borderColor: Colors.grey6,
  },

  menuTitle: {
    fontSize: rem(18),
    color: Colors.grey1,
    fontFamily: 'OpenSans_regular',
  },

  bottomMenuButton: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopWidth: rem(1),
    borderColor: Colors.grey6,
  },
});
