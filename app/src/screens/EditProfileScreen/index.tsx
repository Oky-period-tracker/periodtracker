import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Button } from '../../components/Button'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '../../components/Input'
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { SegmentControl } from '../../components/SegmentControl'
import { genders, locations, yearOptions } from '../../config/options'
import { User } from '../../types'
import { WheelPickerOption } from '../../components/WheelPicker'
import { WheelPickerModal } from '../../components/WheelPickerModal'
import _ from 'lodash'
import { editUser } from '../../redux/actions'
import { httpClient } from '../../services/HttpClient'
import { Text } from '../../components/Text'
import { Hr } from '../../components/Hr'
import { useToggle } from '../../hooks/useToggle'
import { EditPasswordModal } from './EditPasswordModal'
import { EditSecretModal } from './EditSecretModal'
import { useMonths } from '../../hooks/useMonths'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

type EditProfileState = {
  name: User['name']
  gender: User['gender']
  month: number
  year: number
  dateOfBirth: string
  location: User['location']
}

type Action<T extends keyof EditProfileState = keyof EditProfileState> = {
  type: T
  value: EditProfileState[T]
}

const getInitialState = (user: User): EditProfileState => {
  const date = new Date(user.dateOfBirth)

  return {
    name: user.name,
    gender: user.gender,
    month: date.getMonth(),
    year: date.getFullYear(),
    dateOfBirth: user.dateOfBirth,
    location: user.location,
  }
}

function reducer(state: EditProfileState, action: Action): EditProfileState {
  switch (action.type) {
    case 'month': {
      const month = action.value as number
      if (!state.year) {
        return {
          ...state,
          month,
        }
      }

      const dateOfBirth = getDateOfBirth(state.year, month)

      return {
        ...state,
        month,
        dateOfBirth,
      }
    }

    case 'year': {
      const year = action.value as number
      if (!state.month || isNaN(state.month)) {
        return {
          ...state,
          year,
        }
      }

      const dateOfBirth = getDateOfBirth(year, state.month)
      return {
        ...state,
        year,
        dateOfBirth,
      }
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      }
  }
}

const getDateOfBirth = (year: number, month: number) => {
  const day = 2 // Prevents it defaulting to 31st of previous month
  return new Date(year, month, day).toISOString()
}

const validateState = (state: EditProfileState): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  let isValid = true

  if (state.name.length < 3) {
    // TODO: check availability
    isValid = false
    errors.push('username_too_short')
  }

  if (!state.gender) {
    isValid = false
    errors.push('no_gender')
  }

  if (!state.year) {
    isValid = false
    errors.push('no_year')
  }

  if (isNaN(state.month)) {
    isValid = false
    errors.push('no_month')
  }

  if (!state.dateOfBirth) {
    isValid = false
  }

  if (!state.location) {
    isValid = false
    errors.push('no_location')
  }

  return { isValid, errors }
}

const EditProfileScreen: ScreenComponent<'EditProfile'> = ({ navigation }) => {
  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const reduxDispatch = useDispatch()
  const { backgroundColor } = useColor()

  const [passwordModalVisible, togglePasswordModal] = useToggle()
  const [secretModalVisible, toggleSecretModal] = useToggle()

  const initialState = React.useMemo(() => {
    return getInitialState(currentUser)
  }, [currentUser])

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onChangeName = (value: string) => {
    dispatch({ type: 'name', value })
  }

  const onChangeGender = (value: string) => {
    dispatch({ type: 'gender', value })
  }

  const onChangeLocation = (value: string) => {
    dispatch({ type: 'location', value })
  }

  const onChangeMonth = (option: WheelPickerOption | undefined) => {
    const index = monthOptions.findIndex((item) => item.value === option?.value)
    const value = index >= 0 ? index : undefined
    if (value == undefined) {
      return
    }
    dispatch({ type: 'month', value })
  }

  const onChangeYear = (option: WheelPickerOption | undefined) => {
    const value = option ? parseInt(option?.value) : undefined
    if (!value) {
      return
    }
    dispatch({ type: 'year', value })
  }

  const sendEditUserRequest = async (changes: Partial<User>) => {
    await httpClient.editUserInfo({
      appToken,
      ...changes,
    })
  }

  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

  const goToProfile = () => {
    navigation.goBack()
  }

  const onConfirm = async () => {
    const changes = {
      name: state.name,
      dateOfBirth: state.dateOfBirth,
      gender: state.gender,
      location: state.location,
    }

    if (!appToken) {
      editUserReduxState(changes)
      goToProfile()
      return
    }

    try {
      await sendEditUserRequest(changes)
      editUserReduxState(changes)
      goToProfile()
    } catch (error) {
      // TODO: show alert
    }
  }

  const { months, monthOptions } = useMonths()
  const month = months[state.month]
  const year = state.year?.toString()
  const initialMonth = monthOptions.find((item) => item.value === month)
  const initialYear = yearOptions.find((item) => item.value === year)

  const { isValid, errors } = validateState(state)
  const hasChanged = !_.isEqual(state, initialState)

  const canConfirm = hasChanged && isValid
  const confirmStatus = canConfirm ? 'primary' : 'basic'

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* =============== Profile =============== */}
      <View style={[styles.container, { backgroundColor }, globalStyles.shadow]}>
        {/* ===== Name ===== */}
        <View style={styles.segment}>
          <Input
            value={state.name}
            onChangeText={onChangeName}
            placeholder="name"
            errors={errors}
            errorKeys={['username_too_short']}
            errorsVisible={true}
          />
        </View>

        {/* ===== Gender ===== */}
        <View style={styles.segment}>
          <SegmentControl
            label={'your_gender'}
            options={genders}
            selected={state.gender}
            onSelect={onChangeGender}
          />
        </View>

        {/* ===== Month ===== */}
        <View style={styles.segment}>
          <WheelPickerModal
            inputWrapperStyle={styles.wheelPickerModal}
            initialOption={initialMonth}
            options={monthOptions}
            onSelect={onChangeMonth}
            placeholder={'month_of_birth'}
          />
        </View>

        {/* ===== Year ===== */}
        <View style={styles.segment}>
          <WheelPickerModal
            inputWrapperStyle={styles.wheelPickerModal}
            initialOption={initialYear}
            options={yearOptions}
            onSelect={onChangeYear}
            placeholder={'year_of_birth'}
          />
        </View>

        {/* ===== Location ===== */}
        <View style={styles.segment}>
          <SegmentControl
            label={'location'}
            options={locations}
            selected={state.location}
            onSelect={onChangeLocation}
          />
        </View>

        <Button onPress={onConfirm} status={confirmStatus} style={styles.confirm}>
          confirm
        </Button>
      </View>

      {/* =============== Security =============== */}
      <View style={[styles.securityContainer, globalStyles.shadow, { backgroundColor }]}>
        <View style={styles.segment}>
          <TouchableOpacity onPress={togglePasswordModal} style={styles.securityButton}>
            <Text style={styles.securityButtonText}>change_password</Text>
          </TouchableOpacity>
        </View>
        <Hr />
        <View style={styles.segment}>
          <TouchableOpacity onPress={toggleSecretModal} style={styles.securityButton}>
            <Text style={styles.securityButtonText}>change_secret</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== Modals ===== */}
      <EditPasswordModal visible={passwordModalVisible} toggleVisible={togglePasswordModal} />
      <EditSecretModal visible={secretModalVisible} toggleVisible={toggleSecretModal} />
    </ScrollView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 12,
  },
  container: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
  },
  segment: {
    width: '100%',
    flexDirection: 'column',
  },
  confirm: {
    marginTop: 12,
    alignSelf: 'center',
  },
  wheelPickerModal: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  securityContainer: {
    width: '100%',
    borderRadius: 20,
  },
  securityButton: {
    padding: 24,
    justifyContent: 'center',
    alignContent: 'center',
  },
  securityButtonText: {
    textAlign: 'center',
  },
})
