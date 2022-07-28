# suppy-stack
A untidy playground for playing with swr, next, apollo server in a docker-compose stack

**Start the stack up**

```> ./stack.sh```

This will bring up the stack which is a postgres database with a simple table and a node apollo server that has resolvers to do
basic CRUD operations on the database.

* The database is described in ```init.sql``` script. 
* The apollo server is described in the ```index.js``` script
* The ```docker-compose.yml``` file points to the ```Dockerfile``` for apollo server and ```PostgresDockerfile``` for the database

if you get
```Creating suppy-stack_db_1 ... error

ERROR: for suppy-stack_db_1  Cannot start service db: cgroups: cgroup mountpoint does not exist: unknown

ERROR: for db  Cannot start service db: cgroups: cgroup mountpoint does not exist: unknown
ERROR: Encountered errors while bringing up the project.
```

then run ```> ./stack.sh``` again.

you should see...

```
db_1   | 2022-07-28 16:15:53.306 UTC [1] LOG:  starting PostgreSQL 14.4 (Debian 14.4-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
db_1   | 2022-07-28 16:15:53.307 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_1   | 2022-07-28 16:15:53.307 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2022-07-28 16:15:53.309 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2022-07-28 16:15:53.313 UTC [63```] LOG:  database system was shut down at 2022-07-28 16:15:53 UTC
db_1   | 2022-07-28 16:15:53.316 UTC [1] LOG:  database system is ready to accept connections
app_1  | 2022-07-28 16:15:55 Eak, cannot connect, gonna try in 3
app_1  | 2022-07-28 16:15:55 connnected to suppy database
app_1  | 2022-07-28 16:15:55 client in effect 
app_1  | 2022-07-28 16:15:56 🚀  Server ready at....  http://localhost:4000/
```

The stack is up!

In a new terminal....
```
> cd suppy
> npm i
> npm run dev
```

Then you should see something like (the ports might be different)
```
> suppy@0.1.0 dev
> next dev

warn  - Port 3000 is in use, trying 3001 instead.
ready - started server on 0.0.0.0:3001, url: http://localhost:3001
event - compiled client and server successfully in 720 ms (173 modules)
wait  - compiling...
event - compiled successfully in 76 ms (146 modules)
```

And just navigate to the URL (eg http://localhost:3001) and you should be good to go

![image](https://user-images.githubusercontent.com/1777480/181588611-ad3e0cfa-38d6-4d9a-84ba-fbecb0781b94.png)

In the suppy directory there is a simple next.js app, that can be altered and played with. It does a bunch of SWR requests to get books from postgres via the apollo server running in the docker stack. All described in the ```suppy/pages/index.tsx``` file. The docker logs should help outline when things are updated / requested etc to help work out the best approach to use SWR.

