var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Users = require('../models/users')
var Letters = require('../models/letters')
var Datadates = require('../models/datadates')
var Maps = require('../models/maps')

/* GET home page. */
router.get('/users', function (req, res, next) {
  console.log(Users)
  res.json({
    data: 'Test'
  })
});

router.post('/users/register', function (req, res, next) {
  var { email, password, retypepassword } = req.body;

  const token = jwt.sign({ email }, 'my_secret_key');

  Users.findOne({ email: email }, function (err, data) {
    if (err) return handleError(err);
    if (data) {
      res.json('Email already exists')
    } else {
      if (password === retypepassword) {
        Users.create({ email, password, token }, function (err, data) {
          res.status(201).json({
            data: {
              email: data.email
            },
            token: data.token
          })
        })
      } else {
        res.status(201).json({
          msg: "Password not match"
        })
      }
    }
  })
});

router.post('/users/login', function (req, res, next) {
  var { email, password } = req.body;
  // const token = jwt.sign({ email }, 'my_secret_key');

  Users.findOne({ email: email }, function (err, data) {
    if (err) return handleError(err);
    if (data) {
      if (data.password === password) {
        jwt.sign({ email }, 'secretkey', (err, token) => {
          Users.updateMany({ email: email }, { $set: { token: token } }, function (err, response) {
            res.status(201).json({
              data: {
                email: data.email
              },
              token: token
            })
          })
        })
      } else {
        res.status(201).json({
          msg: "Password not match"
        })
      }
    } else {
      res.json({
        msg: "Email not exists"
      })
    }
  })
})

router.post('/users/check', verifyToken, function (req, res, next) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.status(201).json({
        valid: true,
        data: authData
      });
    }
  })
})

router.get('/users/destroy', verifyToken, function (req, res, next) {
  try {
    res.clearCookie("token");
    res.json({
      msg: req.token
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

/*--------------------------------- Challange 31 ---------------------------------------------------------*/
router.post('/data', verifyToken, function (req, res, next) {
  var { letter, frequency } = req.body;

  Letters.create({ letter, frequency }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been added",
      data: data
    })
  })

});

router.get('/data', verifyToken, function (req, res, next) {
  Letters.find({}, (err, data) => {
    res.status(200).json({
      data
    })
  })

})

router.put('/data/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id
  var { letter, frequency } = req.body
  Letters.findByIdAndUpdate(_id, { letter, frequency }, { new: true }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been updated",
      data: data
    })
  })

})

router.delete('/data/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id
  Letters.findByIdAndRemove(_id, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been deleted",
      data: data
    })
  })

})

router.get('/data/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id
  Letters.findById(_id, (err, data) => {
    if (data != null) {
      res.status(200).json({
        success: true,
        message: "data found",
        data: data
      })
    }else{
      res.status(200).json({
        success: false,
        message: "data not found"
      })
    }
  })

})

router.post('/data/search', verifyToken, function (req, res, next) {
  var { letter, frequency } = req.body

  Letters.find({ $or: [{ letter, frequency }, { letter }, { frequency }] }, (err, data) => {
    if (data.length > 0) {
      res.status(201).json({
        data: data
      })
    }else{
      res.status(201).json({
        data: "Data not found"
      })
    }
  })

})

/*--------------------------------- Challange 32 ---------------------------------------------------------*/

router.post('/datadate', verifyToken, function (req, res, next) {
  var { letter, frequency } = req.body;

  Datadates.create({ letter, frequency }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been added",
      data
    })
  })

});

router.get('/datadate', verifyToken, function (req, res, next) {
  Datadates.find({}, (err, data) => {
    if (data.length > 0) {
      res.status(200).json({
        data
      })
    }else{
      res.json({
        msg: 'Data not found'
      })
    }
  })

})

router.put('/datadate/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id
  var { letter, frequency } = req.body
  Datadates.findByIdAndUpdate(_id, { letter, frequency }, { new: true }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been updated",
      data: data
    })
  })

})

router.delete('/datadate/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id;

  Datadates.findByIdAndRemove(_id, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been deleted",
      data: data
    })
  })

});

router.get('/datadate/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id

  Datadates.findById(_id, (err, data) => {
    if (data != null) {
      res.status(201).json({
        success: true,
        message: "data found",
        data: data
      })
    }else{
      res.status(201).json({
        success: false,
        message: "data not found"
      })
    }
  })

})

router.post('/datadate/search', verifyToken, function (req, res, next) {
  var { letter, frequency } = req.body

  Datadates.find({ $or: [{ letter, frequency }, { letter }, { frequency }] }, (err, data) => {
    if (data.length > 0) {
      res.status(201).json({
        data: data
      })
    }else{
      res.status(201).json({
        data: "Data not found"
      })
    }
  })

})

/*--------------------------------- Challange 33 ---------------------------------------------------------*/

router.post('/maps', verifyToken, function (req, res, next) {
  var { title, lat, lang } = req.body;

  Maps.create({ title, lat, lang }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been added",
      data
    })
  })

});

router.get('/maps', verifyToken, function (req, res, next) {
  Maps.find({}, (err, data) => {
    if (data.length > 0) {
      res.status(200).json({
        data
      })
    }else{
      res.json({
        msg: 'Data not found'
      })
    }
  })

})

router.put('/maps/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id
  var { title, lat, lang } = req.body
  Maps.findByIdAndUpdate(_id, { title, lat, lang }, { new: true }, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been updated",
      data: data
    })
  })

})

router.delete('/maps/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id;

  Maps.findByIdAndRemove(_id, (err, data) => {
    res.status(201).json({
      success: true,
      message: "data have been deleted",
      data: data
    })
  })

});

router.get('/maps/:id', verifyToken, function (req, res, next) {
  var _id = req.params.id

  Maps.findById(_id, (err, data) => {
    if (data != null) {
      res.status(201).json({
        success: true,
        message: "data found",
        data: data
      })
    }else{
      res.status(201).json({
        success: false,
        message: "data not found"
      })
    }
  })

})

router.post('/maps/search', verifyToken, function (req, res, next) {
  var { letter, frequency } = req.body

  Maps.find({ $or: [{ letter, frequency }, { letter }, { frequency }] }, (err, data) => {
    if (data.length > 0) {
      res.status(201).json({
        data: data
      })
    }else{
      res.status(201).json({
        data: "Data not found"
      })
    }
  })

})

/*--------------------------------- Verifiy Token --------------------------------------------------------*/
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['token'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}


module.exports = router;
