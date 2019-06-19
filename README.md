# sequelize-api
Built for a fullstack coding challenge. Deployed on heroku at https://sleepy-ravine-96026.herokuapp.com

## Running locally
Since I built this on Linux **I can only guarantee that running locally will work on \*nix systems**.

This project uses Postgres. Use the commands below to install or copy + paste it into a script.

**Linux**
```sh
#!/usr/bin/env bash
# install needed packages
sudo apt-get install -y postgresql libpq-dev
# create user in postgres with name of current system user
sudo -u postgres createuser "$(whoami)" -s
# create database with name of current system user
sudo -u postgres createdb "$(whoami)"
# start postgres server
sudo service postgresql start

# Resource bashrc
  source ~/.bashrc
```

**MacOS**
```sh
#!/usr/bin/env bash
# install postgres via homebrew
brew install postgres
# start postgres
brew services start postgres
# wait a few seconds to allow the service to start
sleep 3s
# create database with current system username `whoami`
createdb

# Resource bashrc
  source ~/.bashrc
```
Once Postgres is installed, `git clone` the project then navigate to `./server/config` and open up `config.json`. This is the Sequelize-CLI config file. Change the values in the `development` object labeled `CHANGE ME` below to your Postgres username and password, respectively.
```json
\\ ./server/config/config.json
...
  "development": {
    "username": CHANGE ME,
    "password": CHANGE ME,
    "database": "todos-dev",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "operatorsAliases": false
  }
 ...

```
For some reason I can't get Sequelize to connect to the dev db without a password, so you come accross an error when connecting, try setting a password for the psql user. This can be done by:
```sh
# running psql
psql

# then enter:
alter user your_username with password 'new_pw'; 

```

Next, `npm install` dependencies. This should also install sequelize-cli locally. Once install is finished, run `sequelize db:create` to create the necessary database, and finally run `sequelize db:migrate` to run migrations.

That should be it. to run the server locally, use `npm run start:dev`. The server should now be running and listening on `port 8000`

