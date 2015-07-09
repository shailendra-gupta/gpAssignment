<?php

/*
 * Following code will create a new store row
 * All store details are read from HTTP Post Request
 */
 
//ini_set('display_errors', 1);
//error_reporting(E_ALL);

// array for JSON response
$response = array();

if (isset($_POST['storeId']) && isset($_POST['storeName']) && isset($_POST['storeOwnerName']) && isset($_POST['storeAboutUs']) && isset($_POST['storeWorkHours']) && isset($_POST['storeProductRange'])) {
        
		$storeId= $_POST['storeId'];
		$storeName= $_POST['storeName'];
		$storeOwnerName= $_POST['storeOwnerName'];
		$storeAboutUs= $_POST['storeAboutUs'];
		$storeWorkHours= $_POST['storeWorkHours'];
		$storeProductRange= $_POST['storeProductRange'];
		$storeLatitude= $_POST['storeLatitude'];
		$storeLongitude= $_POST['storeLongitude'];
		$storeLocation= $_POST['storeLocation'];
		$coverImageUrl= $_POST['coverImageUrl'];
		$photoGalleryUrls= $_POST['photoGalleryUrls'];
		$storeContactNum= $_POST['storeContactNum'];
		$created_at= $_POST['created_at'];
		$updated_at= $_POST['updated_at'];		
	
    // include db connect class
	require_once 'db_connect.php';

    // connecting to db
    $db = new DB_CONNECT();

	$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_error($con));

    // mysql inserting a new row
    $result = mysqli_query($con, "INSERT INTO stores(storeId, storeName, storeOwnerName, storeAboutUs, storeWorkHours, storeProductRange, storeLatitude, storeLongitude, storeLocation, coverImageUrl, photoGalleryUrls, storeContactNum) VALUES('$storeId', '$storeName', '$storeOwnerName', '$storeAboutUs', '$storeWorkHours', '$storeProductRange', '$storeLatitude', '$storeLongitude', '$storeLocation', '$coverImageUrl', '$photoGalleryUrls', '$storeContactNum')");

    // check if row inserted or not
    if ($result) {
        // successfully inserted into database
        $response["success"] = 1;
        $response["message"] = "store successfully created.";

        // echoing JSON response
        echo json_encode($response);
    } else {
        // failed to insert row
        $response["success"] = 0;
        $response["message"] = "Oops! An error occurred.";
        
        // echoing JSON response
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