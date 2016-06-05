-module(message_broadcast).
-behaviour(gen_server).
% Message broadcast callbacks
-export([start_link/0, join/1, quit/1, broadcast/1]).
% Gen server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).
% Record of connected clients
-record(state, {clients=[]}).

start_link() ->
    gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

join(Pid) ->
    io:format("~nPid ~p joining...", [Pid]),
    gen_server:cast(?MODULE, {join, Pid}).

quit(Pid) ->
    io:format("~nPid ~p quitting...", [Pid]),
    gen_server:cast(?MODULE, {quit, Pid}).

broadcast(Msg) ->
    io:format("~nPid sent message ~p", [Msg]),
    gen_server:cast(?MODULE, {broadcast, Msg}).

% Go through every pid in Client array and send a message to them.
internal_broadcast(Msg, #state{clients = Clients}) ->
    lists:foreach(
        fun(ClientPid) -> 
            ClientPid ! {broadcast, self(), Msg}
        end, Clients).

init([]) ->
    Dispatch = cowboy_router:compile([
        {'_', [
            {"/", cowboy_static, {priv_file, mini_irc, "static/index.html"}},
            {"/assets/[...]", cowboy_static, {priv_dir, mini_irc, "static/assets"}},
            {"/websocket", irc_websocket_handler, []}
        ]}
    ]),
    cowboy:start_http(mini_irc, 100, [{port, 9000}], [{env, [{dispatch, Dispatch}]}]),
{ok, #state{}}.

handle_call(_Request, _From, State) ->
    {noreply, State}.

handle_cast({join, Pid}, State = #state{clients = Clients}) -> % Add client to the record
    {noreply, State#state{clients = [Pid|Clients]}};
handle_cast({quit, Pid}, State = #state{clients = Clients}) -> % Remove client to the record
    {noreply, State#state{clients = Clients -- [Pid]}};
handle_cast({broadcast, Msg}, State) -> % Send message from clients to all other clients
    internal_broadcast(Msg, State),
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

terminate(_Reason, _State) ->
    cowboy:stop_listener(mini_irc).