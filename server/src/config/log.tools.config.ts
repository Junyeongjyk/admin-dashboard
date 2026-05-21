import { nowDate } from "../common/functions/common";

interface handleSend {
    data: string;
    discription: string;
}

interface HandleError {
    title: string;
    discription: string;
    error: any;
    status: number;
}

export const log = (title: string, discription: any, error: any): void => {
    console.log(`${nowDate()} | [LOG] |TITLE: ${title} | DESCRIPTION: ${discription} | ERROR: ${error}`)
}

export const handleSend = ( data: any = [], discription: string = "Success", status: number = 1): object => {
    return { status, data, message: discription }
}

export const handleError = (title: string, error: any, discription: string = "ERROR", status: number = 0): object => {
    console.log(`${nowDate()} | [ERROR] | TITLE: ${title} | ERROR: ${error} | DISCRIPTION: ${discription}`)
    return { status, message: discription }
}
