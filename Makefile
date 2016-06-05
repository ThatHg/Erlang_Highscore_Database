PROJECT = wss

DEPS = cowboy lager

dep_cowboy = https://github.com/extend/cowboy.git master
dep_lager = https://github.com/basho/lager.git master


release: clean-release all projects
	    relx -o rel/$(PROJECT)
		 
clean-release: clean-projects
	    rm -rf rel/$(PROJECT)

include erlang.mk
