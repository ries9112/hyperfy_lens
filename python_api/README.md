
# deta.space

I started by deploying the API using deta.space because it's particularly simple to manage: https://fastapi.tiangolo.com/deployment/deta/

To refresh API:

1. `space login`
2. `space push`

To run locally:

`uvicorn main:app --reload`

***HOWEVER***, there is a 250MB limit on deployments and no paid plans yet, and my dependencies were a minimum of 268MB and I couldn't get it working. So instead had to move to create a new deployment on DigitalOcean.

[ remember that in the meantime I can use the fast API in local session to test with hyperfy and can then just swap out the urls ]