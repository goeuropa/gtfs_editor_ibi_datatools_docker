# Migration

## Migrating manager application data
datatools-server offers a way to migrate application data (e.g., due to either breaking application schema changes or server changes). **Note:** this process requires temporarily exposing a `GET` request that exposes the entirety of the manager database.

1. Set the config setting `modules:dump:enabled` to `true`.
2. Restart the application.
3. Download copy of application data to local json file `curl localhost:4000/dump > db_backup.json`.
4. Change dump config setting back to `false`.
5. (optional) If looking to reload into the existing server, delete the manager mapdb (`.db` and `.dbp`) files in `application:data:mapdb`
6. Follow instructions in [`/scripts/load.py`](https://github.com/ibi-group/datatools-ui/blob/master/scripts/load.py) to upload the json data to the new server.
