# Elasticsearch / MongoDB / Monstache Setup

Build and launch the compose file:

```
docker-compose up --build -d
```

We need the IP address of the mongo container. Get the mongo container ID through `docker ps`

```
docker inspect <mongo-container-id>
```
Copy the IP address of the mongo container.

Run the replicate set script:

```
sudo chmod +x ./replicateset.sh
./replicateset.sh <mongo-container-ip-address>
```

If you see "replica set created", you're good to go.

Restart the containers:

```
docker-compose restart
```
