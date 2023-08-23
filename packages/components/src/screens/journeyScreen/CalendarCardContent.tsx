import React from 'react'
import { CalendarList } from '../../components/common/CalendarList'
import styled from 'styled-components/native'
import moment from 'moment'

export const CalendarCardContent = ({ setQuestionAnswer, answersData, questionAnswer, id }) => {
  return (
    <CalendarContainer>
      <CalendarList
        width={300}
        setInputDay={(day) => {
          const today = moment().startOf('day')
          if (parseInt(day.format('YYYYMMDD'), 10) > parseInt(today.format('YYYYMMDD'), 10)) {
            setQuestionAnswer({
              data: answersData.data.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      answer: today.format('DD-MMM-YYYY'),
                    }
                  : item,
              ),
            })
            return
          }
          setQuestionAnswer({
            data: answersData.data.map((item) =>
              item.id === id
                ? {
                    ...item,
                    answer: day.format('DD-MMM-YYYY'),
                  }
                : item,
            ),
          })
        }}
        highlightedDates={{
          [moment(questionAnswer, 'DD-MMM-YYYY').format('YYYY-MM-DD')]: {
            customStyles: {
              container: {
                borderColor: '#E3629B',
                borderWidth: 2,
                backgroundColor: '#E3629B',
                justifyContent: 'center',
                alignItems: 'center',
              },
              text: {
                color: 'white',
                fontWeight: '600',
              },
              selected: true,
              marked: true,
            },
          },
        }}
      />
    </CalendarContainer>
  )
}
const CalendarContainer = styled.View`
  height: 360px;
  width: 300px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: auto;
  margin-bottom: auto;
`
