import { createLogic } from 'redux-logic'
import { LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILED, FETCH_USER_DATA,
    FETCH_USER_DATA_SUCCESS, LOGOUT, LOGOUT_SUCCESS } from './userActions'
import ServerRelay from '../../lib/ServerRelay'
import UserData from '../../lib/UserData'
import to from 'await-to-js'

const login = createLogic({
    type: LOGIN,
    async process({ getState, action }, dispatch, done) {
        const [err, user] = await to(ServerRelay.login(action.email, action.password))
        if(err){
            await dispatch({
                type: LOGIN_FAILED,
                error: err
            })
        }else{
            await UserData.login(user)
            await dispatch({
                type: LOGIN_SUCCESS,
                user: user
            })
        }
        done()
      }
})

const signup = createLogic({
    type: SIGNUP,
    async process({ getState, action }, dispatch, done) {
        const [err, user] = await to(ServerRelay.signup(action.name, action.email, action.password))
        if(err){
            await dispatch({
                type: SIGNUP_FAILED,
                error: err
            })
        }else{
            await UserData.login(user)
            await dispatch({
                type: SIGNUP_SUCCESS,
                user: user
            })
        }
        done()
    }
})

const fetchUserData = createLogic({
    type: FETCH_USER_DATA,
    async process({ getState, action }, dispatch, done) {
        const user = await UserData.getUser()
        if(user !== undefined){
            await UserData.login(user)
            ServerRelay.setJWT(user.jwt)
            await dispatch({
                type: FETCH_USER_DATA_SUCCESS,
                user: user
            })
        }
        done()
    }
})

const logout = createLogic({
    type: LOGOUT,
    async process({ getState, action }, dispatch, done) {
        await UserData.logout()
        ServerRelay.removeJWT()
        await dispatch({type: LOGOUT_SUCCESS})
        done()
    }
})

export default [
    login,
    signup,
    fetchUserData,
    logout
]