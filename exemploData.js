import {format} from 'date-fns'

const currentDate = new Date();
const formattedDate = format(currentDate, 'dd/MM/yyyy HH:mm:ss');
console.log(formattedDate);
console.log(typeof(formattedDate))