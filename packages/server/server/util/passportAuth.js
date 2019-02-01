import passport from 'passport'

export default function passportAuthenticateAsync(strategy, req, res, next) {
    return new Promise((resolve, reject) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) return reject(err)
            return resolve({ user, info })
        })(req, res, next)
    })
}
