import { registerSheet } from 'react-native-actions-sheet';
import SelectDateRangeSelect from './SelectDateRangeSheet/SelectDateRangeSelect';
import SelectLocationSheet from './SelectLocationSheet/SelectLocationSheet';
import SelectAreaSheet from './SelectAreaSheet/SelectAreaSheet';
import SelectAreaOnlyOnceSheet from './SelectAreaOnlyOnceSheet/SelectAreaOnlyOnceSheet';

registerSheet('select-location', SelectLocationSheet);
registerSheet('select-date-range', SelectDateRangeSelect);
registerSheet('select-area', SelectAreaSheet);
registerSheet('select-area-only-once', SelectAreaOnlyOnceSheet);

export {};
