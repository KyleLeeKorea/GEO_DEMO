# Node.js Queryable Encryption Tutorial

- This project demonstrates an example implementation of Queryable Encryption for the MongoDB Node.js driver, including examples of Equality and Range queries.
- This content has been modified and enhanced to enable Range Queries based on the following:
[MongoDB University - Queryable Encryption Examples](https://github.com/mongodb-university/docs-in-use-encryption-examples/tree/main/queryable-encryption) 
- To learn more about Queryable Encryption, see the [[Queryable Encryption section]](https://www.mongodb.com/docs/manual/core/queryable-encryption/) in the Server manual.

## Install Dependencies

To run this sample application, you first need to install the following
dependencies:

- MongoDB Server version 8.0 or later
- Automatic Encryption Shared Library version 8.0 or later
- Node.js
- npm

Sample command
```
sudo apt-get install
sudo apt update
sudo apt install nodejs
sudo apt install npm

```
## Configure Your Environment
- Clone Git
```
git clone https://github.com/KyleLeeKorea/GEO_DEMO 
```

- Please edit the contents of the credential.js according to each respective value.
```
  // Mongo URI
  MONGODB_URI: "<your MongoDB URI here>",
  
```
## Run the App

1. In a shell, navigate to the project root directory(QE_DEMO).

1. Install mongoose
npm install mongoose

1. Run as below
node geo_seoul.js duration batch_size

Sample command
```
node geo_seoul.js 60 1024
```
