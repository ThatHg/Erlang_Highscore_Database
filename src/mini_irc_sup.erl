-module(mini_irc_sup).
-behaviour(supervisor).

-export([start_link/0]).
-export([init/1]).

start_link() ->
    supervisor:start_link({local, ?MODULE}, ?MODULE, []),

% Spawn our message_broadcast worker
init([]) ->
    {ok, {{one_for_one, 5, 10}, 
        [{message_broadcast,
            {message_broadcast, start_link, []},
            permanent,
            5000,
            worker,
            [message_broadcast]}]
    }}.
