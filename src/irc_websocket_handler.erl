-module(irc_websocket_handler).
-behaviour(cowboy_websocket_handler).
-export([init/3]).
-export([websocket_init/3]).
-export([websocket_info/3]).
-export([websocket_handle/3]).
-export([websocket_terminate/3]).

% Uppgrade from http -> web sockets.
init({tcp, http} ,_Req, _Opts) ->
    {upgrade, protocol, cowboy_websocket}.

% Runs whenever clients connect.
websocket_init(_Name, Req, _Opts) ->
    message_broadcast:join(self()),
    {ok, Req, undefined_state}.

% Receives data from client and broadcast it
websocket_handle(Data, Req, State) ->
    case Data of
        {text, Msg} ->
            message_broadcast:broadcast(Msg),
            {ok, Req, State};
        _ ->
            {ok, Req, State}
    end.


% Push data to client
websocket_info(Data, Req, State) ->
    case Data of
        {broadcast, _Pid, Msg} ->
            {reply, {text, Msg}, Req, State};
        _ ->
            {ok, Req, State}
        end.

websocket_terminate(_Reason, _Req, _State) ->
    message_broadcast:quit(self()),
    ok.