import React from 'react';
import { ScrollView } from 'react-native';
import { Separator } from 'native-base';
import { observer } from 'mobx-react';
import { useRoute } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';

import Colors from '../../constants/Colors';
import rem from '../../utils/rem';
import {
  ClassDescription,
  ClassTimetable,
  TeacherPresentation,
  TeacherRating
} from '../../components/ClassDetails/ClassDetails';

/*
Custom accordion; native-base's one had issues on native-base version
https://github.com/GeekyAnts/NativeBase/issues/3428
using dataArray signature to allow future change for native component.
*/

const StudentClassDetails = observer(() => {
  const route = useRoute();
  const { classData, isAssigned } = route.params;

  return (
    <ScrollView showsVerticalScrollIndicator={true} style={style.pageWrapper}>
      <ClassDescription classData={classData} isAssigned={isAssigned} />
      <Separator style={style.separator} />
      <TeacherPresentation teacherData={classData.teacher} />
      {classData.timetable != null && !isAssigned ? (
        <ClassTimetable classData={classData} />
      ) : null}
      <Separator style={style.separator} />
      <TeacherRating classData={classData} isAssigned={isAssigned} />
    </ScrollView>
  );
});

const style = EStyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: Colors.absoluteWhite || 'white',
  },

  separator: {
    height: rem(10),
    backgroundColor: Colors.grey9,
  },
});

export default StudentClassDetails;
