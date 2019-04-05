import passport from 'passport'
import aws from 'aws-sdk'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'

import User from '../models/user'
import Promise from 'bluebird'

const bcrypt = Promise.promisifyAll(require('bcrypt'), { suffix: 'Async' })

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.serializeUser((user, done) => {
    if (!user.email) {
        return done(new Error('serializeuser: user has no email'))
    }
    done(null, user.email)
})

passport.deserializeUser(async (email, done) => {
    try {
        const user = await User.getByEmail(email)
        done(null, user)
    } catch (err) {
        done(err)
    }
})

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:    process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
    try {
        const user = await User.get(jwtPayload.userID)
        if (user === null || user === undefined) {
            return done(null, false)
        }

        done(null, user)
    } catch (err) {
        done(err, null)
    }
}))

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.getByEmail(email, { filterPassword: false, filterMnemonic: false })
        if (user === null || user === undefined) {
            return done(null, false)
        }

        const isMatch = await bcrypt.compareAsync(password, user.passwordHash)
        if (isMatch) {
            // Now manually filter out `passwordHash` as it won't be needed anywhere else
            delete user.passwordHash
            done(null, user)
        } else {
            done(null, false)
        }
    } catch (err) {
        done(err, null)
    }
}))
