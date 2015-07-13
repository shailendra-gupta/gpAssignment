<?php

/*
 * Following code will update a store information
 * A store is identified by store id (storeId)
 */

 //ini_set('display_errors', 1);
//error_reporting(E_ALL);

// array for JSON response
$response = array();

// check for required fields
if (isset($_POST['storeId']) && isset($_POST['storeName']) && isset($_POST['storeOwnerName']) && isset($_POST['storeAboutUs']) && isset($_POST['storeWorkHours']) && isset($_POST['storeProductRange'])) {
    
	$pid= $_POST['pid'];
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

	// include db connect class
	require_once 'db_connect.php';

    // connecting to db
    $db = new DB_CONNECT();

	$con = mysqli_connect(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_error($con));

    // mysql update row with matched pid
    $result = mysqli_query($con,"UPDATE stores SET storeId = '$storeId', storeName = '$storeName', storeOwnerName = '$storeOwnerName' , storeAboutUs = '$storeAboutUs', storeWorkHours = '$storeWorkHours' , storeProductRange = '$storeProductRange', storeLatitude = '$storeLatitude' , storeLongitude = '$storeLongitude', storeLocation = '$storeLocation' , coverImageUrl = '$coverImageUrl', photoGalleryUrls = '$photoGalleryUrls', storeContactNum = '$storeContactNum' WHERE pid = $pid");

    // check if row inserted or not
    if ($result) {
        // successfully updated
        $response["success"] = 1;
        $response["message"] = "store successfully updated.";
        
        // echoing JSON response
        echo json_encode($response);
    } else {
        
    }
} else {
    // required field is missing
    $response["success"] = 0;
    $response["message"] = "Required field(s) is missing";

    // echoing JSON response
    echo json_encode($response);
}
?>
