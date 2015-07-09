<?php

header('Access-Control-Allow-Origin: *'); 
/*
 * Following code will list all the stores
 */
//ini_set('display_errors', 1);
//error_reporting(E_ALL);

// array for JSON response
$response = array();


// include db connect class
require_once 'db_connect.php';

// connecting to db
$db = new DB_CONNECT();

$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_error($con));

// get all stores from stores table
$result = mysqli_query($con, "SELECT *FROM stores") or die(mysqli_error($con));

// check for empty result
if (mysqli_num_rows($result) > 0) {
    // looping through all results
    // stores node
    $response["stores"] = array();
    
    while ($row = mysqli_fetch_array($result,MYSQLI_ASSOC)) {
        // temp user array
        $store = array();
		$store["pid"] = $row["pid"];
		$store["storeId"] = $row["storeId"];
		$store["storeName"] = $row["storeName"];
		$store["storeOwnerName"] = $row["storeOwnerName"];
		$store["storeAboutUs"] = $row["storeAboutUs"];
		$store["storeWorkHours"] = $row["storeWorkHours"];
		$store["storeProductRange"] = $row["storeProductRange"];
		$store["storeLatitude"] = $row["storeLatitude"];
		$store["storeLongitude"] = $row["storeLongitude"];
		$store["storeLocation"] = $row["storeLocation"];
		$store["coverImageUrl"] = $row["coverImageUrl"];
		$store["photoGalleryUrls"] = $row["photoGalleryUrls"];
		$store["storeContactNum"] = $row["storeContactNum"];
		$store["created_at"] = $row["created_at"];
		$store["updated_at"] = $row["updated_at"];		
		
        // push single store into final response array
        array_push($response["stores"], $store);
    }
    // success
    $response["success"] = 1;

    // echoing JSON response
    echo json_encode($response);
} else {
    // no stores found
    $response["success"] = 0;
    $response["message"] = "No stores found";

    // echo no users JSON
    echo json_encode($response);
}
?>
