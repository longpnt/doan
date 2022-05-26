const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLINET_ID = "409460076422-nh6k89c5n2j4sg9p59o73i9191lorqjt.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLINET_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile)

    }
));
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})