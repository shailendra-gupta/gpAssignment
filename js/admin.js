var app = angular.module('storeApp');

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

app.controller("storeController", ["$scope", "$http",  "$window", "$timeout", "$upload", function($scope, $http, $window, $timeout, $upload) {
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
	$scope.photoGalleryUrls;
	$scope.prev_img_gallery_array = [];
	$scope.galleryPathArr = "";
	$scope.coverImageUrl = "";
	$scope.currentPage = 1;
	$scope.pageSize = 5;
	$scope.galleryImagesUploaded = false;
	$scope.coverPicUploaded = false;
	$scope.galleryImagesUploadStatus = [];
	$scope.uploadResult = [];
	$scope.pid = ""

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
//		alert(storeIdForEdit);
	
$http({
	url: "http://grampowertest-bbagentapp.rhcloud.com/get_store_details.php",
		method: "GET",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		params: {"storeId": "\"" + storeIdForEdit + "\""}
	}).success(function(data, status, headers, config) {

			if ( angular.isArray(data.store) ) {
				ctrl.returnedSingleStore = data.store;
				ctrl.singleStore = ctrl.returnedSingleStore[0];
				$scope.pid = ctrl.singleStore.pid;
				$scope.prev_img = "uploads/" + ctrl.singleStore.coverImageUrl;
				$scope.prev_img_gallery_array = ctrl.singleStore.photoGalleryUrls.split(',');
				$scope.prev_img_gallery = "uploads/" + $scope.prev_img_gallery_array[0];
				$scope.searchLocation.lat = ctrl.singleStore.storeLatitude;
				$scope.searchLocation.lng = ctrl.singleStore.storeLongitude;
				$scope.search = ctrl.singleStore.storeLocation;
				$scope.storeStartDay =  ctrl.singleStore.storeStartDay;
				$scope.coverImageUrl = ctrl.singleStore.coverImageUrl;
				$scope.photoGalleryUrls = ctrl.singleStore.photoGalleryUrls;
				$scope.galleryImagesUploaded = true;  //Assuming user uploaded images are available
				$scope.coverPicUploaded = true; //Assuming user uploaded images are available
			}
			else {
				ctrl.returnedSingleStore = [data.store];
				console.log(ctrl.returnedSingleStore);
			}
			}).error(function(data, status, headers, config) {
		alert("Something went wrong, Please try again !!");
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
			$scope.coverImageUrl = $scope.coverPicFileName;
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
			$scope.prev_img_gallery_array.push($scope.prev_img_gallery);
			$scope.photoGalleryUrls = $scope.photoGalleryUrls + "," + element.files[i].name;
		}
		
			$scope.photoGalleryUrls = $scope.photoGalleryUrls.replace(/^,/, "");
};	

$scope.onFilesSelect = function($files) {
for (var i = 0; i < $files.length; i++) {
var $file = $files[i];
$upload.upload({
url: 'http://grampowertest-bbagentapp.rhcloud.com/fileUpload.php',
file: $file,
progress: function(e){}
}).then(function(response) {
$timeout(function() {
$scope.uploadResult.push(response.data);
$scope.galleryImagesUploaded = true; //Presuming to be upload, background check to follow
console.log($scope.uploadResult);
console.log($scope.galleryImagesUploaded);
for (var j = 0; j < $scope.uploadResult.length; j++) {
if(!($scope.uploadResult[j].error == "0")){
$scope.galleryImagesUploaded = false; //Changing to false even if one upload fails
}
}
});
});}
}

$scope.onSingleFileSelect = function($files) {
var $file = $files[0];
$upload.upload({
url: 'http://grampowertest-bbagentapp.rhcloud.com/fileUpload.php',
file: $file,
progress: function(e){}
}).then(function(response) {
$timeout(function() {
$scope.uploadResult.push(response.data);
if($scope.uploadResult["0"].error == "0"){
$scope.coverPicUploaded = true;
}
console.log($scope.uploadResult);
console.log($scope.coverPicUploaded);
});
});
}

	this.postDetails = function postDetails() {
	if($scope.galleryImagesUploaded && $scope.coverPicUploaded){
		
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
		ctrl.subFrame = true;
		ctrl.addFrame = false;
		ctrl.editFrame = false;
	}).error(function(data, status, headers, config) {
		alert("Something went wrong, Please try again !!");
		$scope.status = status;
});
} else {
			alert("Please fill all details and try again");
}

} else {
		alert("Something went wrong, Please try again !!");
}

};

	this.updateDetails = function updateDetails() {
	if($scope.galleryImagesUploaded && $scope.coverPicUploaded){
		if(ctrl.singleStore.storeId != "" && ctrl.singleStore.storeName != "" && ctrl.singleStore.storeOwnerName != "" && ctrl.singleStore.storeAboutUs != "" &&  ctrl.singleStore.storeProductRange != "" &&  $scope.search != ""){
$http({
	url: "http://grampowertest-bbagentapp.rhcloud.com/update_store.php",
		method: "POST",
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: $.param({
	"pid": ctrl.singleStore.pid,
    "storeId": ctrl.singleStore.storeId,
    "storeName": ctrl.singleStore.storeName,
	"storeOwnerName": ctrl.singleStore.storeOwnerName,
    "storeAboutUs": ctrl.singleStore.storeAboutUs,
	"storeWorkHours": ctrl.singleStore.storeStartDay + " - " + ctrl.singleStore.storeEndDay + " , " + ctrl.singleStore.storeStartTime + " - " + ctrl.singleStore.storeEndTime,
    "storeProductRange": ctrl.singleStore.storeProductRange,
	"storeLatitude": $scope.searchLocation.lat,
	"storeLongitude": $scope.searchLocation.lng,
	"storeLocation": $scope.search,
	"coverImageUrl": $scope.coverImageUrl,
	"photoGalleryUrls": $scope.photoGalleryUrls,
	"storeContactNum": ctrl.singleStore.storeContactNum
})
	}).success(function(data, status, headers, config) {
		alert("Store added to database");
		$scope.data = data;
		console.log(data);
		console.log(status);
		ctrl.subFrame = false;
		ctrl.addFrame = false;
		ctrl.editFrame = false;
		ctrl.callServer();
	}).error(function(data, status, headers, config) {
		alert("Something went wrong, Please try again !!");
		$scope.status = status;
});
} else {
			alert("Please fill all details and try again");
}

} else {
		alert("Check Gallery Images, Please try again !!");
}

};

	this.openStore= function openStore(row) {
		ctrl.singleStore = row; 
		ctrl.subFrame = true;
		ctrl.addFrame = false;
		ctrl.editFrame = false;
	};

	this.addNewStore= function addNewStore() {
		ctrl.subFrame = false;
		ctrl.addFrame = true;
		ctrl.editFrame = false;
		$window.scrollTo(0, 0);
		$scope.storeId = "";
		$scope.storeName = "";
		$scope.storeOwnerName = "";
		$scope.storeAboutUs = "";
		$scope.storeProductRange = "";
		$scope.search = "";
		$scope.coverImageUrl = "";
		$scope.photoGalleryUrls = "";
		$scope.storeContactNum = "";
		$scope.prev_img = "images/image_not_found_sq.png"
		$scope.prev_img_gallery = "images/image_not_found_sq.png"
		$scope.searchLocation.lat = "20.5936";
		$scope.searchLocation.lng = "78.9628";
};
	
	this.editStore= function editStore(storeIdForEdit) {
		this.storeIdForEdit = storeIdForEdit;
		ctrl.subFrame = false;
		ctrl.addFrame = false;
		ctrl.editFrame = true;
		$window.scrollTo(0, 0);
		this.callStoreDetails(this.storeIdForEdit);
};

	this.showMainFrame = function showMainFrame(){
		ctrl.subFrame = false;
		ctrl.addFrame = false;
		ctrl.editFrame = false;
		this.callServer();
	};
	
    // Set of Photos
    $scope.photos = [
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
    
	$scope.toggleModal = function(row){
		ctrl.singleStore = row; 
        $scope.showModal = !$scope.showModal;
    };

    $scope.searchLocation = {
      lat: 20.5936, 
      lng: 78.9628 
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
                    alert("Sorry, this search produced no results. Check your internet connection and try again");
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
				ctrl.addFrame = false;
				ctrl.editFrame = false;
                event.preventDefault();
            }
  });
  
  
}]);

app.controller("OtherController", ["$scope", function($scope) {

$scope.pageChangeHandler = function(num) {
    console.log('going to page ' + num);
  };
  	
}]);

app.controller("LoginController", ['$location', 'AuthenticationService', 'FlashService', function($location, AuthenticationService, FlashService) {

        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
  	
}]);

app.controller("RegisterController", ['UserService', '$location', '$rootScope', 'FlashService', function(UserService, $location, $rootScope, FlashService) {

        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
  	
}]);
