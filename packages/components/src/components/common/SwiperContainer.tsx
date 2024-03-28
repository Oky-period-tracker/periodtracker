import React from 'react'
import Swiper from 'react-native-swiper'
import { Platform } from 'react-native'

export const SwiperContainer = React.forwardRef<
  any,
  {
    children: any
    scrollEnabled?: boolean
    style?: any
    pagingEnabled?: boolean
    setIndex?: (args) => void
    onIndexChange?: () => void
    customDotMarginBottom?: number
  }
>(
  (
    {
      children,
      style = {},
      scrollEnabled = null,
      pagingEnabled = null,
      setIndex = (_) => null,
      onIndexChange = () => null,
      customDotMarginBottom,
    },
    ref,
  ) => {
    let androidMargin = 20
    if (customDotMarginBottom) {
      androidMargin = customDotMarginBottom
    }

    return (
      <Swiper
        style={{ ...style }}
        showsButtons={false}
        scrollEnabled={scrollEnabled || false}
        pagingEnabled={pagingEnabled || false}
        removeClippedSubviews={false}
        loop={false}
        onIndexChanged={(ind) => {
          onIndexChange()
          setIndex(ind)
        }}
        dotColor={'#efefef'}
        activeDotColor={'#f9c7c1'}
        dotStyle={{
          width: 18,
          height: 18,
          borderRadius: 10,
          marginBottom: Platform.OS === 'ios' ? 10 : androidMargin,
          elevation: 2,
        }}
        activeDotStyle={{
          width: 18,
          height: 18,
          borderRadius: 10,
          elevation: 6,
          marginBottom: Platform.OS === 'ios' ? 10 : androidMargin,
        }}
        ref={ref}
      >
        {children}
      </Swiper>
    )
  },
)
