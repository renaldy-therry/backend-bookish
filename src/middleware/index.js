const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client();


const generateSecretKey = require('./secretkey');

const secretKey = generateSecretKey();
console.log(secretKey);


class Middleware {

    async createJwtToken(payload) {
        return new Promise((resolve, reject) => {
          jwt.sign(payload, 'c1b5a442b90dacf7df03b674b7518d67713c91808dea7c1565b92e208a067963', (err, jwtToken) => {
            if (err) {
              reject(err);
            } else {
              resolve(jwtToken);
            }
          });
        });
    }

    async verifyIdToken(req, res, next) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const ticket = await client.verifyIdToken({
            idToken: token,
          });
          const payload = ticket.getPayload();
          console.log(payload);
      
          // Store the payload in the req object
          req.payload = payload;

          // Extract email and name from the payload
          const email = payload.email;
          const name = payload.name;

           // Create a JWT token
          const jwtToken = await this.createJwtToken(payload);

          // Store the JWT token in the req object
          req.jwtToken = jwtToken;

           // Save user to database
           const { User } = require('../../models');
          const [user, created] = await User.findOrCreate({
            where: { email: email },
            defaults: { name: name }
        });

        console.log(user.name); // 'name'
        console.log(created); // The boolean indicating whether this instance was just created
        if (created) {
            console.log(user.name); // This will certainly be 'name'
        }
            
          return next();
        } catch (e) {
          console.log(e.message);
          return res.json({ message: 'Internal Error' });
        }
    }

    async validateJwtToken(token) {
      try {
        const payload = await jwt.verify(token, 'c1b5a442b90dacf7df03b674b7518d67713c91808dea7c1565b92e208a067963');
        return payload;
      } catch (error) {
        console.error('Invalid token:', error.message);
        return null;
      }
    }
    
    
}

module.exports = new Middleware();