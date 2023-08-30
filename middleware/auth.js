const jwt = require('jsonwebtoken');
const commonMessages = require('../common/messages');
require('dotenv').config();

const Authentication = (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: commonMessages.tokenNotFound });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ msg: commonMessages.invalidToken });
    }
    req.user = {
      name:verified?.displayname,
      _id: verified.id, 
    };
    next();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = Authentication;
