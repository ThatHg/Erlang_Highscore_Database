-module(mini_irc_app).
-behaviour(application).

-export([start/2]).
-export([stop/1]).

start(_Type, _Args) ->
	db_highscore:init(),
    mini_irc_sup:start_link().

stop(_State) ->
    ok.
