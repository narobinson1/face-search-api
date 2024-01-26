const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  console.log(req.body)
  if (!email || !name || !password) {
    console.log('incorrect form submission')
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    console.log("trx started")
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then((loginEmail) => {
      console.log(loginEmail)
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          console.log("returning user:", user)
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch((err) => {
      console.log("error registering:", err)
      res.status(400).json('unable to register')})
}

module.exports = {
  handleRegister: handleRegister
};


