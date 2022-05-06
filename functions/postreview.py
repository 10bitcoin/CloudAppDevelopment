import sys
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
def main(dict):
    """
    Posts a review to the external Cloudant database

    :param dict: Cloud Functions actions accept a single parameter, which must be a JSON object.
                In this case, the param must be an a JSON object with the key "review" with the review data as value.
                I.e: {
                      "review": 
                                {
                                    "id": 1114,        
                                    "name": "Upkar Lidder",
                                    "dealership": 15,
                                    "review": "Great service!",
                                    "purchase": false,
                                    "another": "field",
                                    "purchase_date": "02/16/2021",
                                    "car_make": "Audi",
                                    "car_model": "Car",
                                    "car_year": 2021
                                }
                    }
                The "id" parameter is the id of the review.
    :return: The action returns a JSON object consisting of the HTTP response, which should contain a success message with code 200
             or an error message with code 500.
    """
    authenticator = IAMAuthenticator('8VxodD5ZTFn7y1yUSOF8XWm3Q3MjTQU4vfrUSXNlnWL-')
    service = CloudantV1(authenticator=authenticator)
    service.set_service_url("https://e33765a3-37fa-4f08-8109-03a9a2aa591b-bluemix.cloudantnosqldb.appdomain.cloud")
    response = service.post_document(db='reviews', document=dict["review"]).get_result()
    try:
    # result_by_filter=my_database.get_query_result(selector,raw_result=True)
        result= {
        'headers': {'Content-Type':'application/json'},
        'body': {'data':response}
        }
        return result
    except:
        return {
        'statusCode': 404,
        'message': 'Something went wrong'
        }