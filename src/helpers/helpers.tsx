import {createSearchParams} from "react-router-dom";
import {Button, IconButton, styled} from "@mui/material";
import React, {useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';

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

interface ImageImportProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete?: () => void;
    imgUrl?: any;
    multiple?: boolean;
}

export function ImageImportButton({ onChange, multiple }: ImageImportProps) {
    return (
        <Button
            component="label"
            variant="outlined"
            color='gray'
            fullWidth
            tabIndex={-1}
            sx={{
                height: '100%',
                borderRadius: '10px',
                background: '#F6F6F6'
                // background: 'rgba(255,255,255,0.35)'
            }}
        >
            <div className='flex flex-col items-center justify-center'>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_170_1742" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse"
                          x="2" y="1" width="16" height="16">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M17.2227 12.4995V3.49951C17.2227 2.67451 16.5477 1.99951 15.7227 1.99951H6.72266C5.89766 1.99951 5.22266 2.67451 5.22266 3.49951V12.4995C5.22266 13.3245 5.89766 13.9995 6.72266 13.9995H15.7227C16.5477 13.9995 17.2227 13.3245 17.2227 12.4995ZM9.27266 9.89701L10.4952 11.532L12.4302 9.11701C12.5802 8.92951 12.8652 8.92951 13.0152 9.11701L15.2352 11.892C15.4302 12.1395 15.2577 12.4995 14.9427 12.4995H7.47266C7.16516 12.4995 6.98516 12.147 7.17266 11.8995L8.67266 9.89701C8.82266 9.70201 9.12266 9.70201 9.27266 9.89701ZM2.22266 15.4995V5.74951C2.22266 5.33701 2.56016 4.99951 2.97266 4.99951C3.38516 4.99951 3.72266 5.33701 3.72266 5.74951V14.7495C3.72266 15.162 4.06016 15.4995 4.47266 15.4995H13.4727C13.8852 15.4995 14.2227 15.837 14.2227 16.2495C14.2227 16.662 13.8852 16.9995 13.4727 16.9995H3.72266C2.89766 16.9995 2.22266 16.3245 2.22266 15.4995Z"
                              fill="black"/>
                    </mask>
                    <g mask="url(#mask0_170_1742)">
                        <rect x="0.722656" y="0.499512" width="18" height="18" fill="#6E6C6A"/>
                    </g>
                </svg>
                <p className='w-full text-center text-[#6E6C6A] text-[10px] font-[500]'>
                    {multiple
                        ? 'Добавить еще'
                        : 'Добавить фото'
                    }
                </p>
            </div>
            <VisuallyHiddenInput
                type="file"
                multiple={multiple}
                onChange={(event)=>onChange(event)}
            />
        </Button>
    )
}
export function ImageImport({ onChange, imgUrl, multiple, onDelete }: ImageImportProps) {
    const [show, setShow] = useState(false)
    return (
        imgUrl === null
            ?
            <ImageImportButton
                multiple={multiple}
                onChange={(event)=>onChange(event)}
            />
            :
            <div className='w-full h-full rounded-[10px] bg-center bg-cover relative overflow-hidden flex justify-center items-center' style={{backgroundImage: `url(${imgUrl})`}}>
                <div className={`absolute top-0 left-0 w-full h-full bg-black ${show ? 'opacity-50' : 'opacity-0'}`}
                     onMouseEnter={(event)=>{
                         setShow(true)
                     }}
                     onMouseLeave={(event)=>{
                         setShow(false)
                     }}
                >
                </div>
                {show &&
                    <Button
                        sx={{
                            borderRadius: '100px',
                            minWidth: '10px',
                        }}
                        variant='contained'
                        color='error'
                        onMouseEnter={(event)=>{
                            setShow(true)
                        }}
                        onClick={onDelete}
                    >
                        <DeleteIcon/>
                    </Button>
                }
            </div>
    )
}