import { registerSheet } from 'react-native-actions-sheet';
import SelectDateRangeSelect from './SelectDateRangeSheet/SelectDateRangeSelect';
import SelectLocationSheet from './SelectLocationSheet/SelectLocationSheet';

registerSheet('select-location', SelectLocationSheet);
registerSheet('select-date-range', SelectDateRangeSelect);

export {};
