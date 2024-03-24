import {createSearchParams} from "react-router-dom";
import {styled} from "@mui/material";

export function CreateSearchParams(params: any){
    const newSearchObj = {...params}
    const keys = Object.keys(newSearchObj)
    for(let i=0;i < keys.length;i++){
        if(newSearchObj[keys[i]] === '' || newSearchObj[keys[i]] === null){
            delete newSearchObj[keys[i]]
        }
    }
    const emptyOrder = !Object.keys(newSearchObj).length;
    return emptyOrder ? '' : `?${createSearchParams(newSearchObj)}`
}

export function ValidateFormSubmitResponse(response: any[], errorFields: any, messageFields: any) {
    return new Promise((resolve, reject) => {
        const newArray: any[] = Object.entries(response).map(([key, value]) => ({ [key]: value }));
        const errors: any = errorFields;
        const messages: any = messageFields;


        for (let i = 0; i < newArray.length; i++) {
            const errorKey: string = Object.keys(newArray[i])[0];
            const message: string[] = newArray[i][errorKey][0];

            findAndModify(errors, errorKey, true);
            findAndModify(messages, errorKey, message);
        }

        resolve({ errors, messages });
        reject('something is wrong...')
    });
}

function findAndModify(obj:any, targetKey: any, newValue: any) {
    for (const key in obj) {
        if (key === targetKey) {
            obj[key] = newValue;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            findAndModify(obj[key], targetKey, newValue);
        }
    }
}

export function checkModalResponse(responseData: any, setModal: any, modal: any) {
    ValidateFormSubmitResponse(responseData, modal.validation.error, modal.validation.message)
        .then((res: any) => {
            setModal((prevState: any)=>({
                ...prevState,
                validation: {
                    ...prevState.validation,
                    error: res.errors,
                    message: res.messages
                },
                requested: false
            }))
        }).catch((err) => {
        console.log(err)
    })
}
export function convertImageUrlToFile(url: any) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], { type: 'image/jpeg' });
                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                resolve(file);
            } else {
                reject(new Error('Failed to convert image URL to file object.'));
            }
        };

        xhr.onerror = function () {
            reject(new Error('Failed to convert image URL to file object.'));
        };

        xhr.send();
    });
}
export function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export function RemoveEmptyObj(params: any) {
    const newSearchObj = { ...params };
    const keys = Object.keys(newSearchObj);
    for (let i = 0; i < keys.length; i++) {
        if (newSearchObj[keys[i]] === "" || newSearchObj[keys[i]] === null) {
            delete newSearchObj[keys[i]];
        }
    }
    return newSearchObj;
}