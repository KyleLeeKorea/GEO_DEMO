# MongoDB and Node.js Geo Spatial Demo


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
const uri = 'mongodb://localhost:27017/geo_benchmark';
  
```
## Run the App

1. In a shell, navigate to the project root directory(GEO_DEMO).

2. 1. Install mongoose
```
npm install mongoose
```
3. Run as below
node geo_seoul.js duration batch_size

Sample command
```
node geo_seoul.js 60 1024
```
