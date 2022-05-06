import sys
from ibmcloudant.cloudant_v1 import CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
def main(dict):
    """
    Gets the car reviews for a specified dealership
    :param dict: Cloud Functions actions accept a single parameter, which must be a JSON object.
                In this case, the param must be an a JSON object with the key "dealerId" with the dealership id as value (string or int)
                I.e: {"id": "15"}
    :return: The action returns a JSON object consisting of the HTTP response with all reviews for the given dealership.
    """
    authenticator = IAMAuthenticator('8VxodD5ZTFn7y1yUSOF8XWm3Q3MjTQU4vfrUSXNlnWL-')
    service = CloudantV1(authenticator=authenticator)
    service.set_service_url("https://e33765a3-37fa-4f08-8109-03a9a2aa591b-bluemix.cloudantnosqldb.appdomain.cloud")
    response = service.post_find(
        db='reviews',
        selector={'dealership': {'$eq': int(dict["id"])}},
        ).get_result()
    try:
        #result_by_filter=my_database.get_query_result(selector,raw_result=True)
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
