const db = require("../models")
const ROLES = db.ROLES
const User = db.user
const jwt = require("jsonwebtoken")
const config = require('../config/auth.config')


const checkDuplicateEmailOrUsername = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      return res.status(400).json({
        message: "Username already exists"
      })
    }
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({
          message: "Email already exists"
        })
      }
      next()
    })
  })
}


const checkRolesExist = (req, res, next) => {
  let rolesBody = req.body.roles
  if(rolesBody) {
    for(let i = 0; i < rolesBody.length; i++) {
      if(!ROLES.includes(rolesBody[i])) {
        res.status(400).json({
          message: `Gagal bro, roles ${rolesBody[i]} tidak ada`
        })
        return;
      }
    }
  }
  next()
}

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]
  if(!token) {
    return res.status(403).json({
      message: "No token"
    })
  }

  jwt.verify(token, config.secretKey, (err, success) => {
    if(err) {
      return res.status(401).json({
        message: "Unautorized"
      })
    }

    req.userId = success.id
  })
}

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
  .then(user => {
    user.getRoles()
    .then(roles => {
      for(let i = 0; i < roles.length; i++) {
        if(roles[i] === "admin") {
          next()
          return;
        }
      }
      res.status(403).json({
        message: "Hanya admin yang boleh akses"
      })
    })
  })
}

const isModerator = (req, res, next) => {
  User.findByPk(req.userId)
  .then(user => {
    user.getRoles()
    .then(roles => {
      for(let i = 0; i < roles.length; i++) {
        if(roles[i] === "admin") {
          next()
          return;
        }
      }
      res.status(403).json({
        message: "Hanya admin yang boleh akses"
      })
    })
  })
}

const verifySignUp = {
  checkDuplicateEmailOrUsername,
  checkRolesExist,
}

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
}

module.exports = {
  verifySignUp, authJwt
}