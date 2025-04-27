import {writable} from 'svelte/store';

const initPop: {
    msg: string,
    title: string,
    isPop: boolean
} = {
    msg: '',
    title: '',
    isPop: false
};
export const popStore = writable(initPop);

export const pop = (message: string, title: string = 'Notification') => {
    setTimeout(() => {
        popStore.set({
            msg: message,
            title: title,
            isPop: true
        })
        setTimeout(() => {
            popStore.set({
                msg: '',
                title: '',
                isPop: false
            })
        }, 2500);
    }, 1);
};

