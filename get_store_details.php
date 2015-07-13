<?php

/*
 * Following code will get single store details
 * A store is identified by store id (storeId)
 */

// array for JSON response
$response = array();


// include db connect class
require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_error($con));

// check for post data
if (isset($_GET['pid'])) {
    $pid = $_GET['pid'];

    // get a store from stores table
    $result = mysqli_query($con, "SELECT *FROM stores WHERE pid = $pid");

    if (!empty($result)) {
        // check for empty result
        if (mysqli_num_rows($result) > 0) {

            $result = mysqli_fetch_array($result,MYSQLI_ASSOC);

            $store = array();
			$store["pid"] = $result["pid"];
			$store["storeId"] = $result["storeId"];
			$store["storeName"] = $result["storeName"];
			$store["storeOwnerName"] = $result["storeOwnerName"];
			$store["storeAboutUs"] = $result["storeAboutUs"];
			$store["storeWorkHours"] = $result["storeWorkHours"];
			$store["storeProductRange"] = $result["storeProductRange"];
			$store["storeLatitude"] = $result["storeLatitude"];
			$store["storeLongitude"] = $result["storeLongitude"];
			$store["storeLocation"] = $result["storeLocation"];
			$store["coverImageUrl"] = $result["coverImageUrl"];
			$store["photoGalleryUrls"] = $result["photoGalleryUrls"];
			$store["storeContactNum"] = $result["storeContactNum"];

		// success
            $response["success"] = 1;

            // user node
            $response["store"] = array();

            array_push($response["store"], $store);

            // echoing JSON response
            echo json_encode($response);
        } else {
            // no store found
            $response["success"] = 0;
            $response["message"] = "No store found";

            // echo no users JSON
            echo json_encode($response);
        }
    } else {
        // no store found
        $response["success"] = 0;
        $response["message"] = "No store found";

        // echo no users JSON
        echo json_encode($response);
    }
} else {
    // required field is missing
    $response["success"] = 0;
    $response["message"] = "Required field(s) is missing";

    // echoing JSON response
    echo json_encode($response);
}
?>