const express = require("express");
const cors = require("cors");
const middleware = require("./middleware");
const booksRouter = require('../routes/books');
const userRouter = require('../routes/user');
const borrowRouter = require('../routes/borrowbook');
const returnRouter = require('../routes/returnbook');

const validateJwtToken = require('./middleware').validateJwtToken;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// app.use(middleware.verifyIdToken);

app.get('/api', middleware.verifyIdToken.bind(middleware), (req, res) => {
  const payload = req.payload; // Access the payload from the middleware
  const jwtToken = req.jwtToken;
  console.log(payload); // Log the payload to the console (optional)

  return res.json({
    payload: payload, // Include the payload in the response
    jwtToken: jwtToken,
  });
});

app.get('/api/:token', async (req, res) => {
  const token = req.params.token;

  try {
    const payload = await validateJwtToken(token);

    if (payload) {
      console.log('Token is valid');
      console.log('Payload:', payload);
      return res.json({ message: 'Token is valid', payload: payload });
    } else {
      console.log('Token is invalid');
      return res.json({ message: 'Token is invalid' });
    }
  } catch (error) {
    console.error(error.message);
    return res.json({ message: 'Internal Error' });
  }
});


app.use('/user', userRouter);

app.use('/books', booksRouter);

app.use('/borrow', borrowRouter);

app.use('/return', returnRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});