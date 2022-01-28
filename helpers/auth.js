const crypto = require('crypto');
const fs = require('fs');

const TOKENSFILE = '.cookies';
const authTokens = {};

// we load cookies from the disk, though in production we'd likely store them in the DB or redis
// the below syntax is a function that's executed once when the module is required
// the function can't be called elsewhere (since it's enclosed in a local scope) but giving it a name documents what it does
(function loadTokensFromDisk() {
    fs.stat(TOKENSFILE, (err, fd) => {
        if (err) {
            console.error('Error accessing tokens file', TOKENSFILE);
            return;
        }
        fs.readFile(TOKENSFILE, 'utf-8', (err, res) => {
            const lines = res.split('\n').filter((line) => {
                if (line != '') return line;
            }); // REPASSER SUR CA
            for (let line of lines) {
                const tokenString = line.split(':');
                authTokens[tokenString[0]] = {
                    userId: tokenString[1],
                    isAdmin: tokenString[2],
                    firstName: tokenString[3],
                };
            }
        });
    });
})();

const writeTokenToDisk = (token, user_id, isAdmin, firstName) => {
    const tokenString = token + ':' + user_id.toString() + ':' + isAdmin.toString() + ':' + firstName.toString() + '\n';

    fs.appendFile(TOKENSFILE, tokenString, (err) => {
        if (err) {
            console.log('Error writing to tokens file', TOKENSFILE);
        }
    });
};

const deleteTokenFromDisk = (token) => {
    fs.readFile(TOKENSFILE, 'utf-8', (err, res) => {
        if (err) {
            console.log('Error reading tokens file', TOKENSFILE);
        } else {
            const data = res.split('\n').filter((line) => {
                if (!line.startsWith(token)) return line;
            });
            fs.writeFile(TOKENSFILE, data.join('\n'), (err) => {
                if (err) {
                    console.log('Error writing to tokens file', TOKENSFILE);
                }
            });
        }
    });
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
};

module.exports = {
    setAuthToken: (userId, res, isAdmin, firstName) => {
        const authToken = generateAuthToken();

        writeTokenToDisk(authToken, userId, isAdmin, firstName);
        authTokens[authToken] = {
            userId,
            isAdmin,
            firstName,
        };
        res.cookie('AuthToken', authToken);
    },

    unsetAuthToken: (req, res) => {
        const authToken = req.cookies['AuthToken'];

        deleteTokenFromDisk(authToken);
        delete authTokens[authToken];
        res.clearCookie('AuthToken');
    },

    getSessionUser: (req, res, next) => {
        const authToken = req.cookies['AuthToken'];
        req.user = authTokens[authToken] ? authTokens[authToken].userId : false;
        req.isAdmin = authTokens[authToken] ? authTokens[authToken].isAdmin : false;
        req.username = authTokens[authToken] ? authTokens[authToken].firstName : false;
        res.locals.user = req.user; // to retrieve the user in the template
        res.locals.isAdmin = req.isAdmin; // to retrieve the isAdmin in the template
        res.locals.username = req.username; // to retrieve the isAdmin in the template
        next();
    },

    requireAuth: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    },

    requireAnon: (req, res, next) => {
        if (req.user) {
            res.redirect('/');
        } else {
            next();
        }
    },
    requireAdmin: (req, res, next) => {
        if (req.isAdmin) {
            next();
        } else {
            res.redirect('/');
        }
    },
    getHashedPassword: (password) => {
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(password).digest('base64');
        return hash;
    },
};
