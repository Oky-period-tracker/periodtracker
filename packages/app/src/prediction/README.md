# Prediction Engine

A period prediction engine with simple moving average future predictions.

## import

import the single instance of the predictor for the prediction engine

```bash
import { predictor } from '@oky/core'
```

## Notes

-Remote debugging when using react-native-calendars does not allow day pressing
-all date arguments are of type moment() from moment js. and are locked to a constant reference point of uct. Pass either moment.uct('xx-yy-20ZZ', 'DD-MM-YYYYY') or moment.uct(timestamp)

## API

### Methods

1. The predictDay method accepts a single argument inputDay (the day you require information about) and returns an object [1] with information specific to that day.

```bash
predictor.predictDay(inputDay)
```

2. The calculateStatusForDateRange method accepts two arguments: start and end Dates and returns an object of shape [2] pertaining to that date range.

```bash
predictor.calculateStatusForDateRange(startDate, endDate)
```

3. The getPredictorState method returns the state object [3] of the current Prediction engine state.

```bash
predictor.getPredictorState()
```

4. The subscribe method accepts a callback and passes the state of the prediction engine. This callback is fired every state update

```bash
predictor.subscribe((state)=> {
     ...
    })
```

5. The currentDayChecking method accepts no args and returns void. The method checks the status of the current day and completes the current cycle and all previous cycles if necessary to automatically start the next cycle. This should be called every time the user logs on or on component mount of the relevant locations.

```bash
predictor.currentDayChecking()
```

6. The calculateFullInfoForDateRange method accepts two arguments: start and end Dates and returns an array of objects shape [1] pertaining to that date range.

```bash
predictor.t(startDate, endDate)
```

### UserInput

The userInputDispatch requires a type declaration and the appropriate day as the payload.

```bash
predictor.userInputDispatch({ type: 'name_of_action', inputDay, errorCallBack?: (err)=>null })
```

action types:

- ['adjust-mens-end'] = changes current cycles' period length to input day. Only accepts input days within current cycle
- ['started-next-cycle'] = ends current cycle passes all current cycle info to history and moves the next predicted cycle forward to selected day. The next cycle is now considered the current cycle
- ['current-start-adjust'] = accepts input days one cycle back and one cycle forward of current cycle start. Moves the starting day of the current cycle to selected day and adjusts the previous months data and future data accordingly.
- ['future-start-adjust'] = accepts input days between 10 days and 50 days forward of current cycle start date. Moves the starting day of the next cycle to selected day and adjusts the previous months data and future data accordingly.

## Data Structures

[1] Status Object Returned from Main Engine

```bash
{
      onPeriod: boolean,
      onFertile: boolean,
      date: moment.utc(),
      cycleDay: number(btw 1 and cycle length),
      daysLeftOnPeriod: number,
      cycleStart: moment.utc(),
      daysUntilNextPeriod: number,
      cycleLength: number,
      periodLength: number,
    }
```
w3fgbn 65
[2] Date range object returned (taiored for react-native-calendars)

```bash
    {   '2019-05-12': { styles...},
        '2019-06-12': { styles...},
        ...
    }
```

[3] Prediction Internal state

```bash
state = {
      currentCycle: {
        startDate: moment.utc('03-06-2019', 'DD-MM-YYYY'),
        periodLength: 5,
        cycleLength: 30,
      },
      smartPrediction: {
        circularPeriodLength: new CircularBuffer(6),
        circularCycleLength: new CircularBuffer(6),
        smaPeriodLength: 5,
        smaCycleLength: 30,
      },
      history: [{
        cycleStartDate: moment.utc('03-05-2019', 'DD-MM-YYYY'),
        cycleEndDate: moment.utc('30-05-2019', 'DD-MM-YYYY'),
        periodLength: 4,
        cycleLength: 28,
       }, {...}, {...}, ...]
    }
```
