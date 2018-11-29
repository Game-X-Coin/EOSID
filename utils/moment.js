import moment from 'moment-timezone';
import { Localization } from 'expo-localization';

console.log(Localization.timezone);

moment.tz.setDefault(Localization.timezone);

console.log(moment.tz);

export default moment;
