const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const db = require("../models");
const config = require("../config/auth.config")
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const signUp = (req, res) => {
  const body = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password)
  }
  const bodyRoles = req.body.roles
  User.create(body)
  .then(user => {
    if(bodyRoles) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: bodyRoles
          }
        }
      })
      .then(roles => {
        user.setRoles(roles).then(() => {
          res.json({
            message: "Berhasil register"
          })
        })
      })
    } else {
      user.setRoles([1]).then(() => {
        res.json({
          message: "Berhasil register"
        })
      })
    }
  })
  .catch((err) => {
    res.status(500).json({
      message: JSON.stringify(err)
    })
  })
}

const signIn = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if(!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    const checkValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    )

    if(!checkValidPassword) {
      return res.status(401).json({
        message: "Invalid password",
      })
    }

    const token = jwt.sign({
      id: user.id
    }, config.secretKey, {
      expiresIn: "10h"
    })
    let autorities = []
    user.getRoles().then(roles => {
      for(let i = 0; i < roles.length; i++) {
        autorities.push("ROLES_" + roles[i].name.toUpperCase())
      }
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: autorities,
        token
      })
    })
  })
  .catch(err => {
    res.status(500).json({
      message: JSON.stringify(err)
    })
  })
}

module.exports = {
  signUp,
  signIn
}