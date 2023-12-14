import * as React from 'react'
import { View } from 'react-native'
import Animated from 'react-native-reanimated'
import { transformOrigin } from 'react-native-redash'
import { CircularElement } from './CircularElement'
import { PanGesture } from './PanGesture'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ColourButtons } from '../ColourButtons'
import { useSelector } from '../../../hooks/useSelector'
import * as selectors from '../../../redux/selectors'
import { navigateAndReset } from '../../../services/navigationService'
import { useCheckDayWarning } from '../../../hooks/usePredictionWarnings'
import { ThemedModal } from '../../../components/common/ThemedModal'
import { SpinLoader } from '../../../components/common/SpinLoader'
import moment from 'moment'
import { ReduxState } from '../../../redux/store'
import { IS_TABLET } from '../../../config/tablet'
import { useOrientation } from '../../../hooks/useOrientation'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'

const { interpolate } = Animated

export function CircularSelection({
  data,
  index,
  isActive,
  currentIndex,
  absoluteIndex,
  disableInteraction = false,
}) {
  const { screenWidth, screenHeight } = useScreenDimensions()
  const orientation = useOrientation()

  const heightMultiplier = IS_TABLET && orientation === 'PORTRAIT' ? 0.6 : 0.55

  const height = screenHeight * heightMultiplier

  const width = IS_TABLET ? 0.6 * screenWidth : 0.65 * screenWidth

  const D = height / 1.6
  const innerR = D / 2

  const [isVisible, setIsVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const l = Math.sin(Math.PI / data.length)
  const r = (innerR * l) / (1 - l)
  const R = innerR + 2 * r
  const cx = width / 2 - r
  const cy = R - r
  const segment = (2 * Math.PI) / data.length
  const rotateZ = interpolate(index, {
    inputRange: [0, data.length],
    outputRange: [0, -2 * Math.PI],
  })

  const isTutorialOneOn = useSelector(selectors.isTutorialOneActiveSelector)
  const checkIfWarning = useCheckDayWarning()
  // automatically close the modal if the wheel start scrolling
  React.useEffect(() => {
    setIsVisible(false)
  }, [currentIndex])

  const navigateToTutorial = () => {
    setLoading(true)
    requestAnimationFrame(() => {
      navigateAndReset('TutorialFirstStack', null)
    })
  }

  const reduxState = useSelector((state) => state)

  const getCardAnswersValues = (inputDay: any) => {
    const verifiedPeriodDaysData = selectors.verifyPeriodDaySelectorWithDate(
      reduxState,
      moment(inputDay.date),
    )

    return verifiedPeriodDaysData
  }

  return (
    <>
      <View style={{ height, width }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 2 * r,
              right: -2 * r,
              top: -10,
              bottom: 10,
            },
            // @ts-ignore
            {
              transform: transformOrigin(0, R - height / 2, {
                // @ts-ignore
                rotateZ,
              }),
            },
          ]}
        >
          {data.map((dataEntry, key) => {
            return (
              <View
                {...{ key }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  // backgroundColor:'cyan',
                  transform: [
                    { translateX: cx },
                    { translateY: cy },
                    { rotateZ: `${key * segment - 0.5 * Math.PI}rad` }, // change the rotation of the circle by 90 degrees so active index is far left
                    { translateY: -cy },
                  ],
                }}
              >
                <CircularElement
                  segment={segment}
                  radius={r}
                  currentIndex={key}
                  cardValues={getCardAnswersValues(dataEntry)}
                  state={reduxState}
                  {...{ isActive, index, dataEntry }}
                />
              </View>
            )
          })}
        </Animated.View>
        {!disableInteraction && (
          <PanGesture
            isX={false}
            ratio={(2 * width) / (data.length / 2)} // the 3 is slowing the rotation speed so no crazy rotations are possible
            {...{ isActive, absoluteIndex }}
          >
            <TouchableOpacity
              onPress={() => {
                if (isTutorialOneOn) {
                  navigateToTutorial()
                  return
                }
                setIsVisible(true)
              }}
              style={{
                height: 100,
                width: 100,
                marginTop: cy,
              }}
            />
          </PanGesture>
        )}
        <ThemedModal {...{ isVisible, setIsVisible }}>
          <ColourButtons
            navigateToTutorial={navigateToTutorial}
            inputDay={data[currentIndex].date}
            hide={() => setIsVisible(false)}
            isCalendar={false}
            onPress={() => setIsVisible(false)}
            selectedDayInfo={data[currentIndex]}
            cardValues={useSelector((state) =>
              selectors.verifyPeriodDaySelectorWithDate(state, moment(data[currentIndex].date)),
            )}
          />
        </ThemedModal>
      </View>
      <SpinLoader isVisible={loading} setIsVisible={setLoading} text="please_wait_tutorial" />
    </>
  )
}
