# Image Resizer
Resizing  image from original image and uload them to S#
## Running Server Using  Dcoker
You'll need docker installed on your machine to run this

### At first set up  `.env`  file

```
    NODE_ENV=development
    SERVER_PORT=3000
    AWS_ACCESS_KEY=<aws_access_key>
    AWS_SECRET_KEY=<aws_secret_key>
    AWS_REGION=<aws_region>
    BUCKET_NAME=<S3_bucket_name>
    BUCKET_BASE_PATH=<bucket_base_url>
    AWS_SQS_URL=<aws_sqs_queue_url>
    REDIS_URL=redis://cache_db

```

## To build the image

 `docker-compose --build`

## To start the server

`docker-compose up`

## to stop the server
`docker-compose down`

## Running Server Using  Dcoker
You'll need `redis` server running on your machine to run this
### At first set up  `.env`  file

```
    NODE_ENV=development
    SERVER_PORT=3000
    AWS_ACCESS_KEY=<aws_access_key>
    AWS_SECRET_KEY=<aws_secret_key>
    AWS_REGION=<aws_region>
    BUCKET_NAME=<S3_bucket_name>
    BUCKET_BASE_PATH=<bucket_base_url>
    AWS_SQS_URL=<aws_sqs_queue_url>
    REDIS_URL=redis://localhost:6379

```
 ### install npm packages
   `npm i` or `npm install`

### run the server 
   `npm run server`

### run the worker
   `npm run worker`


## Api docs

## For upload the image and required resolutions

  `url: <baseUrl>/api/v1/images/
  headers:{
      "Content-Type": "multipart/form-data"
  }
  body:{
      "files":<filePath>,
      "public":"yes" or "no"
      "resolutions":{"width":200,"height":100,"public":"no"},{"width":200,"height":200,"public":"yes"}
  }`
  -- example curl
   ` curl --request POST \
    --url '<baseUrl>/api/v1/images/?=' \
    --header 'Content-Type: multipart/form-data' \
    --form files=<filePath> \
    --form public=yes \
    --form 'resolutions=[{"width":200,"height":100,"public":"no"},{"width":200,"height":200,"public":"yes"}]'`

##  Geting Image resize stat
    `url: <baseUrl>/api/v1/images/
    headers:{
        "Content-Type": "pplication/json"
    }
    body:{
        "original_image":"PNG_1.png"
    }`

    -- example curl
        `curl --request POST \
        --url https://5547-103-155-219-35.ngrok.io/api/v1/images/resize/stat \
        --header 'Content-Type: application/json' \
        --data '{
            "original_image":"PNG_1.png"
        }'`
  

