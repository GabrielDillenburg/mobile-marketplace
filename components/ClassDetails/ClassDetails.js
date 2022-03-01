/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  LogBox,
} from 'react-native';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Card, CardItem, Icon, Col, Grid, View, Separator } from 'native-base';
import { Rating } from 'react-native-ratings';

import Toast from 'react-native-toast-message';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/core';
import { flowResult } from 'mobx';

import rem from '../../utils/rem';
import Colors from '../../constants/Colors';
import Avatar from '../Avatar/Avatar';
import TextAreaForm from '../Card/InputComponent';
import Accordion from '../Accordion/Accordion';
import Timetable from '../Timetable/Timetable';
import Text from '../Text/Text';
import Button from '../Button/Button';
import DaysOfTheWeek from '../../constants/DaysOfTheWeek';
import {
  sortDays,
  insertTime,
  formatTime,
  daysString,
} from '../../utils/timeFunctions';
import createLink from '../../utils/googleMaps';
import { useStore } from '../../hooks';
import openUrl from '../../utils/openUrl';
import Hooray from '../Svg/Hooray';
/**
 * @file Separate file for processing and rendering class details screen's sections.
 */

const ClassDescription = ({ classData, isAssigned }) => {
  const store = useStore();

  const [averange, setAverange] = useState({});

  const init = async () => {
    let res = await flowResult(
      store.classDataStore.fetchRating(classData?.teacher.profile?.id),
    );
    console.log(res);
    setAverange(res);
  };

  useEffect(() => {
    init();
  }, []);

  const onlineClassModal = () => {
    store.uiStore.modal({
      type: 'prompt',
      title: 'Você gostaria de acessar a aula via computador?',
      subtitle: 'Enviaremos o link da aula por e-mail.',
      cancelText: 'Acessar pelo celular',
      cancelCallback: () => openUrl(classData.meetUrl),
      confirmText: 'Enviar e-mail',
      confirmCallback: async () => {
        if (await classData.sendMail()) {
          Toast.show({
            type: 'success',
            text1: 'E-mail enviado com sucesso!',
          });
        }
      },
    });
  };

  const renderClassLink = () => {
    const onlineLink =
      classData.meetUrl && classData.timetable && isAssigned ? (
        <TouchableOpacity onPress={onlineClassModal}>
          <View style={style.locationWrapper}>
            <Icon
              type="MaterialIcons"
              name="open-in-new"
              style={style.locationPin}
            />
            <Text
              style={{
                ...style.location,
                textDecorationLine: 'underline',
              }}
            >
              Aula online
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={style.locationWrapper}>
          <Icon
            type="MaterialIcons"
            name="laptop-mac"
            style={style.locationPin}
          />
          <Text style={style.location}>Aula online</Text>
        </View>
      );

    const addressLink = (
      <TouchableOpacity onPress={() => openUrl(createLink(classData.location))}>
        <View style={style.locationWrapper}>
          <Icon type="Ionicons" name="location" style={style.locationPin} />
          <Text
            style={{
              ...style.location,
              textDecorationLine: 'underline',
            }}
          >
            {classData.location?.address_name?.length
              ? classData.location.address_name
              : classData.location.address}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return classData.isOnline ? onlineLink : addressLink;
  };

  return (
    <>
      <CardItem cardBody>
        <Image
          source={{
            uri:
              classData?.images?.length && classData?.images[0]?.url?.length
                ? classData.images[0].url
                : null,
          }}
          style={style.cardPicture}
        />
        <Grid style={style.headerGrid}>
          {averange && (
            <Col style={style.headerAverange}>
              <Text style={style.headerTitle}>
                <Icon
                  type="MaterialIcons"
                  name="star-rate"
                  style={style.headerIcon}
                />
                {`${
                  averange && averange.ratingAvg
                    ? Number(averange.ratingAvg).toFixed(1)
                    : '-'
                } (${averange.count || '-'})`}
              </Text>
            </Col>
          )}
          <Col style={style.headerValue}>
            <Text style={style.headerTitle}>
              R${' '}
              {Number(classData.value || 1)
                .toFixed(2)
                .replace('.', ',')}{' '}
              / Aula
            </Text>
          </Col>
        </Grid>
      </CardItem>

      <Card transparent style={style.classCard}>
        {/* Used cardBody even for header and location to eliminate extra paddings, impossible with the other options. */}
        <CardItem cardBody>
          <Text style={style.title} fontWeight="semibold">
            {classData.title}
          </Text>
        </CardItem>
        {classData.ageGroup != null ? (
          <CardItem cardBody>
            <Text style={style.age}>{classData.ageGroup}</Text>
          </CardItem>
        ) : null}
        <CardItem cardBody>
          <Text style={style.description}>{classData.description}</Text>
        </CardItem>
        {renderClassLink()}
      </Card>
    </>
  );
};

const TeacherPresentation = ({ teacherData }) => (
  <Card transparent style={style.teacherCard}>
    <Grid style={{ alignItems: 'center' }}>
      <Col style={style.teacherPictureColumn}>
        <Avatar source={teacherData?.profile?.image?.url} size={80} />
      </Col>
      <Col>
        <Text fontSize={18} color={Colors.black3}>{`${
          teacherData.profile.name
        } ${teacherData.profile.last_name.substring(0, 1)}.`}</Text>
        {/* <Text style={style.description}>{teacherData.presentation}</Text> */}
      </Col>
    </Grid>
  </Card>
);

const TeacherRating = ({ classData, isAssigned }) => {
  const store = useStore();

  const [mounted, setMounted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const ratingTeacher = async (comment) => {
    let student = store?.studentStore?.student?.id;
    let name = store?.studentStore?.student?.name;

    let teacher = classData?.teacher?.profile?.id;
    let avatar = store.studentStore?.student?.image;

    console.log(store?.studentStore?.student);

    await flowResult(
      store.classDataStore.saveRating(student, teacher, comment, avatar, name),
    );
    Toast.show({
      type: 'success',
      text1: 'Sucesso!',
    });

    await init();
  };

  const inputCallbackRating = (closure) => (
    <TextAreaForm callback={ratingTeacher} closure={closure} />
  );

  const ratingTeacherModal = (teacher) => {
    console.log(teacher);
    store.uiStore.modal({
      type: 'input',
      title: 'Avaliação',
      subtitle: 'Avalie seu professor!',
      name: `${teacher.profile.name} ${teacher.profile.last_name}`,
      component: () => (
        <Rating
          imageSize={30}
          onFinishRating={(value) => {
            store.classDataStore.setTeacherRating(value);
          }}
          style={{ paddingVertical: 10 }}
        />
      ),
      inputCallback: inputCallbackRating,
    });
  };

  const init = async () => {
    setIsFetching(true);

    let res = await flowResult(
      store.classDataStore.fetchRating(classData?.teacher.profile?.id, true),
    );
    setIsFetching(false);
    setMounted(true);

    console.log('rating', res);
    console.log('rating', store.classDataStore.ratingsList);
  };

  useEffect(() => {
    if (!mounted) init();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={store.classDataStore.ratingsList}
        contentContainerStyle={{ paddingBottom: rem(30) }}
        renderItem={({ item }) => (
          <View style={style.cardContainer}>
            <Card transparent style={style.teacherCard}>
              <Grid style={{ alignItems: 'center' }}>
                <Col style={style.teacherPictureColumn}>
                  <Avatar source={item?.avatar} size={80} />
                </Col>
                <Col>
                  <Text
                    fontSize={18}
                    style={{ fontWeight: 'bold' }}
                    color={Colors.black3}
                  >
                    {item?.name}
                  </Text>
                  <Text
                    fontSize={16}
                    style={{ marginTop: rem(10) }}
                    color={Colors.black3}
                  >
                    {Number(item?.rating).toFixed(1)}
                    {new Array(item?.rating).fill(1).map((e, i) => (
                      <Icon
                        key={i}
                        type="MaterialIcons"
                        name="star-rate"
                        style={style.headerIcon}
                      />
                    ))}
                  </Text>
                  <Text
                    fontSize={14}
                    style={{ marginTop: rem(10) }}
                    color={Colors.black3}
                  >
                    {new Date(item?.createdAt).getDay()}/
                    {new Date(item?.createdAt).getMonth() + 1}/
                    {new Date(item?.createdAt).getFullYear()}
                  </Text>
                  {/* <Text style={style.description}>{teacherData.presentation}</Text> */}
                </Col>
              </Grid>
              <Grid style={{ alignItems: 'center', marginTop: rem(30) }}>
                <Col style={{ marginLeft: rem(10) }}>
                  <Text fontSize={14} color={Colors.black3}>
                    {item?.comment}
                  </Text>
                  {/* <Text style={style.description}>{teacherData.presentation}</Text> */}
                </Col>
              </Grid>
            </Card>
            <Separator style={style.ratingSeparator} />
          </View>
        )}
        keyExtractor={(_, index) => `${index}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: rem(30) }}>
            <Text style={style.descriptionNoClasses}>
              Professor ainda não avaliado
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={style.cardContainer}>
            {isAssigned && (
              <View
                style={{
                  paddingHorizontal: rem(30),
                  paddingBottom: rem(30),
                  marginTop: rem(35),
                }}
              >
                <Button
                  backgroundColor={Colors.blue1}
                  onPress={() => {
                    ratingTeacherModal(classData?.teacher);
                  }}
                  full
                >
                  <Text fontWeight="bold" color="white">
                    Avaliar professor
                  </Text>
                </Button>
              </View>
            )}
            <Grid
              style={{
                alignItems: 'center',
                marginTop: rem(isAssigned ? 0 : 35),
              }}
            >
              <Col style={{ marginLeft: rem(35) }}>
                <Text
                  fontSize={18}
                  color={Colors.black3}
                  style={{ fontWeight: 'bold' }}
                >
                  Avaliações
                </Text>
              </Col>
              <Col style={style.headerAverange}>
                <Text
                  style={{ fontWeight: 'bold', right: rem(10), left: rem(80) }}
                >
                  <Icon
                    type="MaterialIcons"
                    name="star-rate"
                    style={style.headerIcon}
                  />
                  {`${
                    store.classDataStore.ratingScore
                      ? Number(
                          store.classDataStore.ratingScore?.ratingAvg,
                        ).toFixed(1)
                      : '-'
                  } (${store.classDataStore.ratingScore?.count || '0'})`}
                </Text>
              </Col>
            </Grid>
          </View>
        }
        ListFooterComponent={observer(() =>
          !mounted && isFetching ? (
            <View style={{ paddingVertical: rem(30) }}>
              <ActivityIndicator color={Colors.blue1} />
            </View>
          ) : null,
        )}
        refreshing={mounted && isFetching}
        onRefresh={init}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const ClassTimetable = observer(({ classData }) => {
  const store = useStore();
  const navigation = useNavigation();

  const data = classData.timetable.map((item) => {
    const schedule = {};
    schedule.days = JSON.parse(item.weekdays).sort(sortDays);
    schedule.time = formatTime(item.time);
    schedule.id = item.id;
    console.log(4.5 * classData.value * (schedule?.days?.length || 1));
    return schedule;
  });

  const reduced = {};

  data.forEach((item) => {
    const key = DaysOfTheWeek[item.days[0]].index + item.days.join('');
    reduced[key] = insertTime(reduced[key], item);
  });

  const newDataArray = [];

  Object.entries(reduced)
    .sort()
    .forEach((entry) => {
      newDataArray.push({
        title: daysString(entry[1].days),
        content: <Timetable timeList={entry[1].hours} classData={classData} />,
      });
    });

  const confirmationModal = () => {
    store.uiStore.modal({
      type: 'alert',
      title: 'Ebaaa!',
      subtitle:
        'Quando o professor aceitar seu pedido ele irá aparecer na sua lista de aulas.',
      image: () => <Hooray />,
    });
  };

  const submitSubscription = async () => {
    classData.estimatedValue =
      4.5 *
      classData.value *
      (JSON.parse(classData?.timetable[0]?.weekdays || []).length || 1);

    const financialStatus = flowResult(
      await classData.validateStudent(store?.studentStore?.student?.id),
    );
    console.log('ruim', res);

    if (financialStatus === 'NOT_HAS_FINANCIAL') {
      financialModal();
      return;
    } else if (financialStatus === 'NOT_HAS_VALUE') {
      opsModal();
      return;
    }

    const res = flowResult(await classData.assignStudent());
    if (res) {
      confirmationModal();
      navigation.navigate('Explore');
    }
  };

  const attentionModal = () => {
    store.uiStore.modal({
      type: 'prompt',
      title: 'Atenção!',
      enumerators: [
        '- A primeira aula não é cobrada.',
        '- Em caso de ausência, informe os professores com até 12 horas de antecedência para não ser cobrado pela aula.',
        '- Em caso de cancelamento das aulas, será nessário efetuar o pagamento das aulas já realizadas.',
      ],
      confirmText: 'Continuar',
      confirmCallback: () => submitSubscription(),
    });
  };

  const opsModal = () => {
    store.uiStore.modal({
      type: 'prompt',
      title: 'Ops!',
      subtitle: `Por algum problema com o cartão de crédito, não foi possível autorizar a matrícula. Por favor, consulte-nos em "ajuda", no seu perfil, ou altere seus dados em "financeiro" e tente novamente.`,
      confirmText: 'Continuar',

      confirmCallback: () => flowResult(store?.studentStore?.webapp()),
    });
  };

  const financialModal = () => {
    store.uiStore.modal({
      type: 'prompt',
      title: 'Ops!',
      subtitle: `Verificamos que você ainda não cadastrou seus dados de pagamento, clique em Financeiro, para ser direcionado para nosso app financeiro`,
      confirmText: 'Continuar',

      confirmCallback: () => flowResult(store?.studentStore?.webapp()),
    });
  };

  function numberToCurrency(value) {
    return String(
      Number(value)
        .toFixed(2)
        .replace(/[^0-9.-]+/g, '')
        .replace('.', ','),
    );
  }
  console.log('aqui', classData);
  return (
    <>
      <Separator style={style.separator} />
      <Accordion dataArray={newDataArray} />

      <View>
        <Text fontWeight="bold" style={style.valueText}>
          Estimativa mensal: R${' '}
          {numberToCurrency(
            4.5 *
              classData.value *
              (JSON.parse(classData?.timetable[0]?.weekdays || []).length || 1),
          )}
        </Text>
      </View>

      <View style={style.scheduleButton}>
        <Button
          disabled={
            classData.classTime == null || classData.classTimeId == null
          }
          backgroundColor={
            classData.classTime == null || classData.classTimeId == null
              ? Colors.grey4
              : Colors.blue1
          }
          onPress={() => {
            attentionModal();
          }}
          full
        >
          <Text fontWeight="bold" color="white">
            Agendar aula
          </Text>
        </Button>
      </View>
    </>
  );
});

ClassDescription.propTypes = {
  classData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
    timetable: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        weekdays: PropTypes.string,
        shift: PropTypes.oneOf(['morning', 'afternoon', 'night']),
        time: PropTypes.string,
        duration: PropTypes.string,
      }),
    ),
    location: PropTypes.shape({
      address_cep: PropTypes.string,
      address: PropTypes.string,
      address_number: PropTypes.string,
      address_complement: PropTypes.string,
      address_neighborhood: PropTypes.string,
      address_city: PropTypes.string,
      address_state: PropTypes.string,
    }),
    ageGroup: PropTypes.string,
    teacher: PropTypes.shape({
      picture: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    isOnline: PropTypes.bool,
    meetUrl: PropTypes.string,
    sendMail: PropTypes.func,
  }).isRequired,
};

TeacherPresentation.propTypes = {
  teacherData: PropTypes.shape({
    profile: PropTypes.shape({
      name: PropTypes.string,
      last_name: PropTypes.string,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
    presentation: PropTypes.string,
  }).isRequired,
};

TeacherRating.propTypes = {
  classData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })),
    timetable: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        weekdays: PropTypes.string,
        shift: PropTypes.oneOf(['morning', 'afternoon', 'night']),
        time: PropTypes.string,
        duration: PropTypes.string,
      }),
    ),
    location: PropTypes.shape({
      address_cep: PropTypes.string,
      address: PropTypes.string,
      address_number: PropTypes.string,
      address_complement: PropTypes.string,
      address_neighborhood: PropTypes.string,
      address_city: PropTypes.string,
      address_state: PropTypes.string,
    }),
    ageGroup: PropTypes.string,
    teacher: PropTypes.shape({
      picture: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    isOnline: PropTypes.bool,
    meetUrl: PropTypes.string,
    sendMail: PropTypes.func,
  }).isRequired,
};

ClassTimetable.propTypes = {
  classData: PropTypes.shape({
    timetable: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        weekdays: PropTypes.string,
        shift: PropTypes.oneOf(['morning', 'afternoon', 'night']),
        time: PropTypes.string,
        duration: PropTypes.string,
      }),
    ).isRequired,
  }),
};

export { ClassDescription, TeacherPresentation, ClassTimetable, TeacherRating };

const style = EStyleSheet.create({
  cardPicture: {
    ...EStyleSheet.absoluteFillObject,
    position: 'absolute',
    height: rem(160),
    width: 'auto',
    backgroundColor: Colors.grey2,
  },

  headerGrid: {
    alignItems: 'flex-end',
    top: rem(10),
    marginBottom: rem(130),
  },

  headerIcon: {
    alignItems: 'center',
    marginRight: rem(12),
    fontSize: rem(14),
    color: '#ffb600',
  },

  headerTitle: {
    fontSize: rem(14),
    fontFamily: 'OpenSans_bold',
    color: '#fff',
  },

  headerValue: {
    left: rem(80),
    right: rem(20),
  },

  headerAverange: {
    left: rem(20),
    right: rem(100),
  },

  classCard: {
    paddingHorizontal: rem(30),
    paddingVertical: rem(20),
  },

  age: {
    fontSize: rem(14),
    color: '#9AA0A1',
    paddingVertical: rem(5),
  },

  description: {
    fontSize: rem(16),
    color: Colors.grey2,
    paddingVertical: rem(5),
  },

  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rem(10),
  },
  location: {
    fontSize: rem(14),
    color: Colors.grey2,
  },

  locationPin: {
    fontSize: rem(20),
    color: Colors.grey2,
    width: rem(25),
  },

  teacherCard: {
    paddingHorizontal: rem(30),
    paddingVertical: rem(20),
  },

  teacherPictureColumn: {
    width: rem(100),
  },

  scheduleButton: {
    paddingHorizontal: rem(30),
    paddingBottom: rem(30),
  },

  separator: {
    height: rem(10),
    backgroundColor: Colors.grey9,
  },

  ratingSeparator: {
    height: rem(1),
    width: '90%',
    left: rem(20),
    backgroundColor: Colors.grey9,
  },

  valueText: {
    textAlign: 'center',
    marginBottom: rem(20),
  },
});
