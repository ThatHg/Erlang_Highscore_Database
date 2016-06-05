-module(db_highscore).
%-compile(export_all).
-export([init/0]).
-include_lib("stdlib/include/qlc.hrl").

% We need to add the date somehow.
-record(userscore, {id, uname, score, date}).

init() ->
    mnesia:create_schema([node()]),
    mnesia:start(),
    mnesia:create_table(userscore,
        [ {disc_copies, [node()] },
             {attributes,      
                record_info(fields,userscore)} ]),
    insert(66, "Lars", 0, "Now"),
    select(66),
    select_some("Lars"),
    select_all(),
    select_search(0).

 
insert(Id, Uname, Score, Date) ->
    Fun = fun() ->
         mnesia:write(
         #userscore{id=Id,
                    uname=Uname,
                    score=Score,
                    date=Date} )
               end,
         mnesia:transaction(Fun).
  
select(Id) ->
    Fun = 
        fun() ->
            mnesia:read({userscore, Id})
        end,
    {atomic, [Row]}=mnesia:transaction(Fun),
    io:format(" ~p ~p ~p ~n ", [Row#userscore.uname, Row#userscore.score, Row#userscore.date] ).

select_some(Uname) ->
    Fun = 
        fun() ->
            mnesia:match_object({userscore, '_', Uname, '_' } )
        end,
    {atomic, Results} = mnesia:transaction(Fun),
    Results.
 
select_all() -> 
    mnesia:transaction( 
    fun() ->
        qlc:eval( qlc:q(
            [ X || X <- mnesia:table(userscore) ] 
        )) 
    end ).
  
select_search(Word) -> 
    mnesia:transaction( 
    fun() ->
         qlc:eval( qlc:q(
              [ {F0,F1,F2,F3} || 
                   {F0,F1,F2,F3} <- 
                        mnesia:table(userscore),
                        (string:str(F2, Word)>0) or  
                        (string:str(F3, Word)>0)
               ] )) 
    end ).