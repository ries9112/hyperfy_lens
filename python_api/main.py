from fastapi import FastAPI
import json
from google.cloud import bigquery
from google.oauth2 import service_account
import os

# gcp_key = json.load(os.getenv("GCP_KEY"))

with open('mlflow-291816-333a8dfdc1e7.json', 'r') as f:
    gcp_key = json.load(f)

app = FastAPI()

# check API is running
@app.get("/")
def read_root():
    return {"Hello": "World"}

# example of a path parameter
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# example with bigquery
@app.get("/test-bq")
def test_bq():
    # create the credentials object using the key data
    credentials = service_account.Credentials.from_service_account_info(gcp_key)

    # create the BigQuery client with the provided credentials
    client = bigquery.Client(credentials=credentials)

    # example query
    profile_query = f"""
    SELECT
    profile_id,
    owned_by,
    name,
    handle,
    profile_picture_s3_url,
    block_timestamp
    FROM `lens-public-data.polygon.public_profile`
    WHERE handle = 'rickydata.lens'
    """

    # return data
    return client.query(profile_query).to_dataframe()
