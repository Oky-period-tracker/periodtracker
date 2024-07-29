"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarCardContent = void 0;
const react_1 = __importDefault(require("react"));
const CalendarList_1 = require("../../components/common/CalendarList");
const native_1 = __importDefault(require("styled-components/native"));
const moment_1 = __importDefault(require("moment"));
const CalendarCardContent = ({ setQuestionAnswer, answersData, questionAnswer, id }) => {
    return (<CalendarContainer>
      <CalendarList_1.CalendarList width={300} setInputDay={(day) => {
            const today = (0, moment_1.default)().startOf('day');
            if (parseInt(day.format('YYYYMMDD'), 10) > parseInt(today.format('YYYYMMDD'), 10)) {
                setQuestionAnswer({
                    data: answersData.data.map((item) => item.id === id
                        ? Object.assign(Object.assign({}, item), { answer: today.format('DD-MMM-YYYY') }) : item),
                });
                return;
            }
            setQuestionAnswer({
                data: answersData.data.map((item) => item.id === id
                    ? Object.assign(Object.assign({}, item), { answer: day.format('DD-MMM-YYYY') }) : item),
            });
        }} highlightedDates={{
            [(0, moment_1.default)(questionAnswer, 'DD-MMM-YYYY').format('YYYY-MM-DD')]: {
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
        }}/>
    </CalendarContainer>);
};
exports.CalendarCardContent = CalendarCardContent;
const CalendarContainer = native_1.default.View `
  height: 360px;
  width: 300px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: auto;
  margin-bottom: auto;
`;
//# sourceMappingURL=CalendarCardContent.jsx.map