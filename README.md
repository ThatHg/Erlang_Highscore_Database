# Erlang_Highscore_Database (Secure)

Highscore database written in Erlang.

Secure websockets based on https://github.com/DanThiffault/cowboy-wss-example

## Steps

 1. git clone https://github.com/ThatHg/Erlang_Highscore_Database.git
 1. ```openssl req -x509 -newkey rsa:2048 -keyout priv/ssl/key.pem -out priv/ssl/cert.pem -days 365 -nodes```
 1. make all
 1. make rel
 1. ./_rel/bin/wss_hs_db start
 1. visit http://localhost:8080 or https://localhost:8443

If you're using https, make sure to change the connection to wss://localhost:8443

## Debugging 

tail -F _rel/log/*


## Useful links

 * [Erlang.mk](https://github.com/extend/erlang.mk)
 * [Relx release creation](https://github.com/erlware/relx)
 * [Explanation of Erlang.mk & Relx](http://ninenines.eu/articles/erlang.mk-and-relx/)

