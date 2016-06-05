PROJECT = wss

DEPS = cowboy lager

release: clean-release all projects
	    relx -o rel/$(PROJECT)
		 
clean-release: clean-projects
	    rm -rf rel/$(PROJECT)

include erlang.mk
