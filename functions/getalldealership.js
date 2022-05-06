/**
  * 
  * main() will be run automatically when this action is invoked in IBM Cloud
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *        In this case, the param can be an empty JSON object, a JSON object with the key "dealerID" and the 
  *        id of a dealership as the value, or a JSON object with the key "state" and the name of a state as value. 
  *        I.e: {} or {"state": "California"} or {"id": "14"}
  * @return The action returns a JSON object consisting of the HTTP response, i.e:
  *         {
  *             "body": {
  *                 "bookmark": "g1AAAABweJzLYWBgYMpgSmHgKy5JLCrJTq2MT8lPzkzJBYormCamJJuZmxkYplpampumGCWlGBoapZkkJiWmGaYkpxmD9HHA9BGlIwsAxe0fhw",
                    "docs": [
                        {
                            "_id": "5adc67601e9975d2bd112f4abaf0ba06",
                            "_rev": "1-34e7ebd07643af43db578a46ee1d6365",
                            "address": "3 Nova Court",
                            "city": "El Paso",
                            "full_name": "Holdlamis Car Dealership",
                            "id": 1,
                            "lat": 31.6948,
                            "long": -106.3,
                            "short_name": "Holdlamis",
                            "st": "TX",
                            "state": "Texas",
                            "zip": "88563"
                        },
                        ..., 
                    ],
                    ...
                }
            }
**/

function main(params) {

    secret={
        "COUCH_URL": "https://e33765a3-37fa-4f08-8109-03a9a2aa591b-bluemix.cloudantnosqldb.appdomain.cloud",
        "IAM_API_KEY": "8VxodD5ZTFn7y1yUSOF8XWm3Q3MjTQU4vfrUSXNlnWL-",
        "COUCH_USERNAME": "e33765a3-37fa-4f08-8109-03a9a2aa591b-bluemix"
        };

    console.log(params);

    return new Promise(function (resolve, reject) {

        const Cloudant = require('@cloudant/cloudant');

        const cloudant = Cloudant({
            url: secret.COUCH_URL,
            plugins: {iamauth: {iamApiKey:secret.IAM_API_KEY}}
        });

        const dealershipDb = cloudant.use('dealerships');

        if (params.state) {

            // return dealership with this state

            dealershipDb.find({

                "selector": {
                    "state": {
                        "$eq": params.state
                        }
                    }
                }, function (err, result) {

                    if (err) {
                        console.log("🚀 ~ file: index.js ~ line 20 ~ err", err)
                        reject(err);
                    }

                    let code=200;

                    if (result.docs.length==0)
                    {
                        code= 404;
                    }
                    resolve({
                        statusCode: code,
                        headers: { 'Content-Type': 'application/json' },
                        body: result
                        });
                    });

                } else if (params.id) {

                        id=parseInt(params.dealerId)

                        // return dealership with this state
                      dealershipDb.find({selector: {id:parseInt(params.id)}}, function (err, result) {
                            if (err) {

                                console.log("🚀 ~ file: index.js ~ line 20 ~ err", err)
                                reject(err);
                            }

                            let code=200;

                            if (result.docs.length==0)
                            {
                                code= 404;
                            }

                            resolve({
                                statusCode: code,
                                headers: { 'Content-Type': 'application/json' },
                                body: result
                                });
                                });
                        } else {
                                // return all documents

                                dealershipDb.list({ include_docs: true }, function (err, result) {
                                    if (err) {
                                        console.log("🚀 ~ file: index.js ~ line 35 ~ err", err)
                                        reject(err);
                                        }
                                    resolve({
                                        statusCode: 200,
                                        headers: { 'Content-Type': 'application/json' },
                                        body: result
                                        });
                                    });
                                }
                        });
}