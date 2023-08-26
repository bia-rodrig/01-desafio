import {format} from 'date-fns'

export function getFormattedData(){
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy HH:mm');

    return formattedDate

}