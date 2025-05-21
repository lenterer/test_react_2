import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "../../firebase";

export const actionUserName = () => (dispatch) =>{
    setTimeout(() => {
        return dispatch({type: 'CHANGE_USER', value: 'Es Batu'})
    }, 2000);
}

export const registerUserAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {     
        dispatch({type: 'CHANGE_ISLOADING', value: true})
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('success: ', user);
                dispatch({type: 'CHANGE_ISLOADING', value: false})
                resolve(true)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                dispatch({type: 'CHANGE_ISLOADING', value: false})
                reject(false)
            })
    })
}

export const loginUserAPI = (data) => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'CHANGE_ISLOADING', value: true})
        const auth = getAuth();
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('success: ', user);
                const dataUser = {
                    email: user.email,
                    uid: user.uid
                }
                dispatch({type: 'CHANGE_ISLOADING', value: false})
                dispatch({type: 'CHANGE_ISLOGIN', value: true})
                dispatch({type: 'CHANGE_USER', value: dataUser})
                resolve(true)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                dispatch({type: 'CHANGE_ISLOADING', value: false})
                dispatch({type: 'CHANGE_ISLOGIN', value: false})
                reject(false)
            })
    })
}