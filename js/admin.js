var app = angular.module("storeApp", ['smart-table','ngAnimate', 'ngTouch','angularUtils.directives.dirPagination']);

app.controller("storeController", ["$scope", "$http",  "$window", function($scope, $http, $window) {
    var ctrl = this;
    this.displayed = [];
    this.data = [];
	$scope.gPlace;
	this.storeIdForEdit;
	var mapOptions;
    var googleMap;
    var searchMarker;
    var searchLatLng;
	$scope.coverPicFileName="";
	$scope.coverPic="";
	$scope.galleryImageFileName="";
	this.uploadTrial = 0;
	$scope.photoGalleryUrls = [];
	$scope.prev_img_gallery_array = "";
	$scope.galleryPathArr = "";
	$scope.coverImageUrl = "";
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	
    this.colCtrl = {
        pid: true,
        storeId: true,
        storeName: true,
        storeOwnerName: true,
        storeAboutUs: true,
        storeWorkHours: true,
        storeProductRange: true,
        storeLatitude: true,
        storeLongitude: true,
        storeLocation: true,
        coverImageUrl: true,
        photoGalleryUrls: true,
        storeContactNum: true
    };
    this.showMore = true;
    this.callServer = function callServer() {
        $http.get('http://grampowertest-bbagentapp.rhcloud.com/get_all_stores_info.php').
		success(function(data) {
		if ( angular.isArray(data.stores) ) {
				$scope.stores = data.stores;
			}
			else {
				$scope.stores = [data.stores];
			}
        }).
        error(function(data) {
            console.error("Failed to load data");
        });
    };
    this.callServer();
    
    this.callStoreDetails = function callStoreDetails(storeIdForEdit) {
		alert(storeIdForEdit);
/*        $http.get('http://grampowertest-bbagentapp.rhcloud.com/get_store_details.php/?storeId="' + storeIdForEdit + '"').
		success(function(data) {
		if ( angular.isArray(data.store) ) {
				$scope.singelStore = data.store;
				alert($scope.singelStore.storeId);
			}
			else {
				$scope.singelStore = [data.store];
				alert(data.store);
			}
        }).
        error(function(data) {
            console.error("Failed to load data");
        });*/
		
$http({
		url: 'http://grampowertest-bbagentapp.rhcloud.com/get_store_details.php/?storeId="' + storeIdForEdit + '"',
		method: "GET",
	}).success(function(data, status, headers, config) {
		if ( angular.isArray(data.store) ) {
				$scope.singelStore = data.store;
				alert($scope.singelStore.storeId);
			}
			else {
				$scope.singelStore = [data.store];
				alert(data.store);
			}
	}).error(function(data, status, headers, config) {
		alert("Something went wrong during data retrieval, Please try again !!");
		$scope.status = status;
});
		
    };

	$scope.cover_pic_changed = function(element) {

   			var photofile = element.files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				$scope.$apply(function() {
					$scope.prev_img = e.target.result;
				});
			};
			reader.readAsDataURL(photofile);
			$scope.coverPic = $scope.prev_img;
			$scope.coverPicFileName = element.files[0].name;
			//alert($scope.coverPicFileName);
};	

	 this.uploadCoverPic = function uploadCoverPic() {
		if($scope.coverPicFileName != ""){
		//alert(imageNameArr[imageNameArr.length-1]);
$http({
		url: "http://grampowertest-bbagentapp.rhcloud.com/fileUpload.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({
    "image": $scope.coverPic,
    "filename": $scope.coverPicFileName
})
	}).success(function(data, status, headers, config) {
		this.coverPicUploaded = true;
		$scope.data = data;
		$scope.coverImageUrl = $scope.coverPicFileName;
	}).error(function(data, status, headers, config) {
		alert("Something went wrong during cover pic upload, Please try again !!");
		this.coverPicUploaded = false;
		$scope.status = status;
});
}
};

	$scope.multiple_files_added = function(element) {

 for (var i = 0; i < element.files.length; i++) {
   			var photofile = element.files[i];
			var reader = new FileReader();
			reader.onload = function(e) {
				$scope.$apply(function() {
					$scope.prev_img_gallery = e.target.result;
				});
			};
			reader.readAsDataURL(photofile);
			$scope.prev_img_gallery_array = $scope.prev_img_gallery_array + "," + $scope.prev_img_gallery;
			$scope.galleryImageFileName = $scope.galleryImageFileName + "," + element.files[i].name;
		}
};	

	 this.uploadGalleryImages = function uploadGalleryImages() {
	 
		var galleryImageFileNameArr = $scope.galleryImageFileName.split(",");
		var galleryPathArr = $scope.prev_img_gallery_array.split(",");
		if($scope.galleryImageFileName != ""){
 for (var i = 0; i < galleryImageFileNameArr.length; i++) {
$http({
		url: "http://grampowertest-bbagentapp.rhcloud.com/fileUpload.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({
    "image": $scope.galleryPathArr[i],
    "filename": galleryImageFileNameArr[i]
})
	}).success(function(data, status, headers, config) {
		this.galleryImagesUploaded = true;
		$scope.data = data;
		$scope.photoGalleryUrls = $scope.photoGalleryUrls + "," + galleryImageFileNameArr[i];
	}).error(function(data, status, headers, config) {
		alert("Something went wrong during gallery images upload, Please try again !!");
		this.galleryImagesUploaded = false;
		$scope.status = status;
});
}
}
};

	this.postDetails = function postDetails() {
	ctrl.isLoading = true;
	if(this.uploadTrial < 1){
	this.uploadCoverPic();
	this.uploadGalleryImages();
	}
	if((this.galleryImagesUploaded && !this.coverPicUploaded) || (!this.galleryImagesUploaded && this.coverPicUploaded) || (!this.galleryImagesUploaded && !this.coverPicUploaded) && 	this.uploadTrial < 1){
		alert("Something went wrong during Image Upload, Please choose both cover pic & gallery images and try again !!");
	this.uploadTrial = 	this.uploadTrial + 1;
	} else {	
		if(this.uploadTrial >= 1 && this.uploadTrial < 2 ){
		alert("Adding retail store to database without cover pic / gallery images");
		} //Showing alert only once
	this.uploadTrial = 	this.uploadTrial + 1;
		
		if($scope.storeId != "" && $scope.storeName != "" && $scope.storeOwnerName != "" && $scope.storeAboutUs != "" &&  $scope.storeProductRange != "" &&  $scope.search != ""){ 
$http({
	url: "http://grampowertest-bbagentapp.rhcloud.com/create_store.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({
    "storeId": $scope.storeId,
    "storeName": $scope.storeName,
	"storeOwnerName": $scope.storeOwnerName,
    "storeAboutUs": $scope.storeAboutUs,
	"storeWorkHours": $scope.storeStartDay + " - " + $scope.storeEndDay + " , " + $scope.storeStartTime + " - " + $scope.storeEndTime,
    "storeProductRange": $scope.storeProductRange,
	"storeLatitude": $scope.searchLocation.lat,
	"storeLongitude": $scope.searchLocation.lng,
	"storeLocation": $scope.search,
	"coverImageUrl": $scope.coverImageUrl,
	"photoGalleryUrls": $scope.photoGalleryUrls,
	"storeContactNum": $scope.storeContactNum
})
	}).success(function(data, status, headers, config) {
		alert("Store added to database");
		$scope.data = data;
	}).error(function(data, status, headers, config) {
		alert("Something went wrong, Please try again !!");
		$scope.status = status;
});
} else {
			alert("Please fill all details and try again");
}

}

};
	this.subFrame = false;
	this.addEditFrame = false;

	this.openStore= function openStore(row) {
		ctrl.singleStore = row; 
		ctrl.subFrame = true;
		ctrl.addEditFrame = false;

	};

	this.addNewStore= function addNewStore() {
		ctrl.subFrame = false;
		ctrl.addEditFrame = true;
		$window.scrollTo(0, 0);
		$scope.storeId = "";
		$scope.storeName = "";
		$scope.storeOwnerName = "";
		$scope.storeAboutUs = "";
		$scope.storeStartDay  = "";
		$scope.storeEndDay = "";
		$scope.storeStartTime = "";
		$scope.storeEndTime = "";
		$scope.storeProductRange = "";
		$scope.searchLocation.lat = "";
		$scope.searchLocation.lng = "";
		$scope.search = "";
		$scope.coverImageUrl = "";
		$scope.photoGalleryUrls = "";
		$scope.storeContactNum = "";
};
	
	this.editStore= function editStore(storeIdForEdit) {
		this.storeIdForEdit = storeIdForEdit;
		ctrl.subFrame = false;
		ctrl.addEditFrame = true;
		$window.scrollTo(0, 0);
		this.callStoreDetails(this.storeIdForEdit);
		$scope.storeId = $scope.singelStore.storeId;
		$scope.storeName = $scope.singelStore.storeName;
		$scope.storeOwnerName = $scope.singelStore.storeOwnerName;
		$scope.storeAboutUs = $scope.singelStore.storeAboutUs;
		$scope.storeStartDay  = $scope.singelStore.storeStartDay;
		$scope.storeEndDay = $scope.singelStore.storeEndDay;
		$scope.storeStartTime = $scope.singelStore.storeStartTime;
		$scope.storeEndTime = $scope.singelStore.storeEndTime;
		$scope.storeProductRange = $scope.singelStore.storeProductRange;
		$scope.searchLocation.lat = $scope.singelStore.searchLocation.lat;
		$scope.searchLocation.lng = $scope.singelStore.searchLocation.lng;
		$scope.search = $scope.singelStore.search;
		$scope.coverImageUrl = $scope.singelStore.coverImageUrl;
		$scope.photoGalleryUrls = $scope.singelStore.photoGalleryUrls;
		$scope.storeContactNum = $scope.singelStore.storeContactNum;
};

	this.showMainFrame = function showMainFrame(){
		ctrl.subFrame = false;
		ctrl.addEditFrame = false;
		this.callServer();
	};
	
    // Set of Photos
    $scope.photos = [
        {src: 'images/h_store11.png', desc: 'Image 01'},
        {src: 'images/h_store10.png', desc: 'Image 02'},
        {src: 'images/h_store9.png', desc: 'Image 03'},
        {src: 'images/h_store8.png', desc: 'Image 04'},
        {src: 'images/h_store7.png', desc: 'Image 05'},
        {src: 'images/h_store6.png', desc: 'Image 06'}
    ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
	
	$scope.showModal = false;
    
	$scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

    $scope.searchLocation = {
      lat: 26.9, 
      lng: 75.8 
    }
	
    $scope.gotoLocation = function (lat, lng) {
        if ($scope.searchLocation.lat != lat || $scope.searchLocation.lng != lng) {
            $scope.searchLocation = { lat: lat, lng: lng };
            if (!$scope.$$phase) $scope.$apply("searchLocation");
        }
    };

    // geo-coding
    $scope.search = "";
    $scope.geoCode = function () {
        if ($scope.search && $scope.search.length > 0) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ 'address': $scope.search }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var searchLocation = results[0].geometry.location;
                    $scope.search = results[0].formatted_address;
                    $scope.gotoLocation(searchLocation.lat(), searchLocation.lng());
                } else {
                    alert("Sorry, this search produced no results.");
                }
            });
        }
    };
			
  $scope.pageChangeHandler = function(num) {
      console.log('stores page changed to ' + num);
  };
			
$scope.$on('my:keyup', function(event, keyEvent) {
			  //console.log('keyup', keyEvent);
			  if(keyEvent.keyCode === 27 ) {
				ctrl.subFrame = false;
				ctrl.addEditFrame = false;
                event.preventDefault();
            }
  });
  
}]);

app.directive('gmap',function(){
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope:{
        myModel: '=ngModel',
        latitude: '@',
        longitude: '@',
		mdraggable: '@'
		},
    link: function(scope,element,attrs,ngModel){
        
      var mapOptions;
      var googleMap;
      var searchMarker;
      var searchLatLng;
      
		if( scope.latitude != "" && scope.longitude != ""){
			if ( (/^[A-Za-z]+$/.test(scope.latitude)) || (/^[A-Za-z]+$/.test(scope.longitude)) ) {
			scope.myModel = { lat: "20.5936", lng: "78.9628" };
			} else {
            scope.myModel = { lat: scope.latitude, lng: scope.longitude };
			}
		}

      ngModel.$render = function(){

		searchLatLng = new google.maps.LatLng(scope.myModel.lat, scope.myModel.lng);

        mapOptions = {
            center: searchLatLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

        googleMap = new google.maps.Map(element[0],mapOptions);
		
        if(scope.mdraggable == "true"){
		            
        searchMarker = new google.maps.Marker({
          position: searchLatLng,
          map: googleMap,
          draggable: true
        });
        
        google.maps.event.addListener(searchMarker, 'dragend', function(){
          scope.$apply(function(){
            scope.myModel.lat = searchMarker.getPosition().lat();
            scope.myModel.lng = searchMarker.getPosition().lng();
          });
        }.bind(this));

		} else {

        searchMarker = new google.maps.Marker({
          position: searchLatLng,
          map: googleMap,
          draggable: false
        });
        		
		}
		
		var center = googleMap.getCenter();
		google.maps.event.trigger(googleMap, "resize");
		googleMap.setCenter(center);
  
      };
      
      scope.$watch('myModel', function(value){
		if(scope.mdraggable == "true"){
			ngModel.$render();
		}
      }, true);

  }      
  }
});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {country: 'in'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());                
                });
            });
        }
    };
});

app.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + 
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
  
  app.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (!value) {
            element.attr('src', attrs.errSrc);  
          }
      });

      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

app.controller("OtherController", ["$scope", function($scope) {
$scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
  	
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 27 ) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});


/*app.config(function ($routeProvider) {
    $routeProvider.
    when('/subFrame', {
        templateUrl: 'subFrame.html',
        controller: 'subFrameController'
    }).
    when('/addEditFrame', {
        templateUrl: 'addEditFrame.html',
        controller: 'addEditFrameController'
    }).
    otherwise({
        redirectTo: '/home'
    });
});*/
