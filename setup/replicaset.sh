#!/bin/bash

# this configuration is so important 
echo "Starting replica set initialize"
until mongo --host $1 --eval "print(\"waited for connection\")"
do
    sleep 2
done
echo "Connection finished"
echo "Creating replica set"
mongo --host $1 <<EOF
rs.initiate(
  {
    _id : 'rs0',
    members: [
      { _id : 0, host : "db:27017", priority : 1 }
    ]
  }
)
EOF
echo "replica set created"
