const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const sha1 = require('sha1');

import {databaseConnection as database} from './app.database';

export class Security {
    public passport = passport;


    public initMiddleware = (server : any) => {
        server.use(passport.initialize());
    };

    public authorize = this.passport.authenticate('bearer', { session: false });
}



let validPassword = (player: any, password: any) => {
    
    return sha1(password) === player.passwordHash;
}

passport.use(new LocalStrategy((username, password, done) => {
    console.log("sec:: " + "user: " + username + " pass: " + password);    
    database.db.collection('players').findOne({
        username: username
    }).then(player => {
        console.log("found user: " + player);
        if (player === null) {
            console.log("player === null");
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        if (!validPassword(player, password)) {
            console.log("!validPassword");
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        console.log("before token: " + player.token);
        player.token = sha1(player.username+ Date.now());
        console.log("play-Token: " + player.token);
        database.db.collection('players')
            .updateOne({_id: player._id}, {$set: {token: player.token}})
            .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, player))
            .catch(err => done(err));
    }).catch(err => done(err));
}));

passport.use(new BearerStrategy((token, done) => {
    database.db.collection('players')
        .findOne({token: token})
        .then((user) => user ? done(null, user, {scope:'all'}) : done(null, false))
        .catch(err => done(err));
}));


