EWD.sockets.log = true;   // *** set this to false after testing / development

EWD.application = {
  name: 'homeEx', // **** change to your application name
  timeout: 3600,
  login: false,
  labels: {
    'ewd-title': 'home Exchange',                                     // *** Change as needed
    'ewd-navbar-title-phone': 'Home Exchange App',                    // *** Change as needed
    'ewd-navbar-title-other': 'HomeExchange Application'    // *** Change as needed
  },
  /*from ewdUplaod*/
  setStatus: function(status){
      if(status){
          $('#upLoadStatusOff').hide();
          $('#upLoadStatusOn').show();
      }else{
          $('#upLoadStatusOff').show();
          $('#upLoadStatusOn').hide();
      }
  },
   /*end from ewdUplaod*/
  navFragments: {
    main: {
      cache: true
    },
    about: {
      cache: true
    },
	 ulistingfrag: {
      cache: true
    },
	 logout: {
      cache: true
    },
	searchfrag: {
      cache: true
    }
  },

  onStartup: function() {
	 /* micro servuce test start 
	 console.log('app.js: invoking EWD.require to load the uploadService front-end service');

    EWD.require({
      serviceName:'uploadService',
      targetSelector:'#test_Container',
      done: function() {
        console.log('app.js: uploadService service loaded successfully');
      }
    });
	/* micro servuce test end */
	
	
	
    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //$('#InfoPanelCloseBtn').click(function(e) {
    //  $('#InfoPanel').modal('hide');
    //});
    //EWD.getFragment('header.html', 'header'); 
	//EWD.getFragment('products.html', 'products');
	//EWD.getFragment('latest.html', 'latest');
	 EWD.bootstrap3.nav.enable();
	 
	EWD.getFragment('about.html', 'about_Container');
	//EWD.getFragment('navlist.html', 'navList'); 
	EWD.getFragment('main.html', 'main_Container'); 
	EWD.getFragment('searchfrag.html', 'search_Container'); 
	EWD.getFragment('singlefrag.html', 'single_Container');
	EWD.getFragment('ulistingfrag.html', 'ulisting_Container');
	EWD.getFragment('testfrag.html', 'test_Container'); 
	EWD.getFragment('signinfrag.html', 'signin_Container');
	EWD.getFragment('signupfrag.html', 'signup_Container');
	EWD.getFragment('logoutfrag.html', 'logout_Container');
	
	EWD.initNavbar = function(){
		 $('#navbar-username').hide();
	};
	EWD.updateNavBar = function(){
		 $('#navbar-username').text("Welcome Guy");
		 $('#navbar-username').show();
		 $('#signin_Nav').hide();
		 $('#signup_Nav').hide();
	};
	EWD.loadListing = function(messageObj){
		//property vars
		 var propertyType = messageObj.data.houseId[101].type;
		 var carExchange = messageObj.data.houseId[101].carExchange;
		 var children = messageObj.data.houseId[101].houseRules.children;
		 var pets = messageObj.data.houseId[101].houseRules.pets;
		 var smoking = messageObj.data.houseId[101].houseRules.smoking;
		//profile vars
		
		var adultsNo =  messageObj.data.profile.adultsNo;
		var childrensNo =  messageObj.data.profile.childrensNo;
		var groupNo =  messageObj.data.profile.groupNo;
		var profileDesc =  messageObj.data.profile.profileDesc;
		var profileName =  messageObj.data.profile.profileName;
		var profileTitle =  messageObj.data.profile.profileTitle;
		//update the DOM
			    $('#navbar-username').show();
				document.getElementById(propertyType).checked = true;
				$('#property-accomodates').val(messageObj.data.houseId[101].accomodate);
				$('#property-title').val(messageObj.data.houseId[101].desc.headline);
				$('#property-bathrooms').val(messageObj.data.houseId[101].bathrooms);
				$('#property-bedrooms').val(messageObj.data.houseId[101].bedrooms);
				$('#property-area').val(messageObj.data.houseId[101].area);
				$('#property-description').val(messageObj.data.houseId[101].desc.body);
				$('#property-hLocation').val(messageObj.data.houseId[101].location.desc);
				$('#property-hLocation').val(messageObj.data.houseId[101].location.desc);
	
				if (carExchange ==='Negotiable'){
					$('#carExchange-negotiable').prop('checked', true);
					}
				if (carExchange ==='Prefered'){
					$('#carExhgange-preferred').prop('checked', true);
					}
				if (carExchange ==='notPossible'){
					$('#carExchange-notpossible').prop('checked', true);
					}
				if (smoking ==='allowed'){
					$('#smoking0').prop('checked', true);
					}
				if (smoking ==='notAllowed'){
					$('#smoking1').prop('checked', true);
					}
				if (pets ==='Allowed'){
					$('#pets0').prop('checked', true);
					}
				if (pets ==='notAllowed'){
					$('#pets1').prop('checked', true);
					}
				if (children ==='suitable'){
					$('#children0').prop('checked', true);
					}
				if (children ==='notSuitable'){
					$('#children1').prop('checked', true);
					}
				//load profile of ownerDocument
				$('#profile-name').val(profileName);
				$('#profile-groupNo').val(groupNo);
				$('#profile-adultsNo').val(adultsNo);
				$('#profile-childrensNo').val(childrensNo);
				$('#profile-title').val(profileTitle);
				$('#profile-desc').val(profileDesc);
				//load images of the house
				EWD.loadImages(messageObj);
				
	};
	EWD.enablePopovers = function() {
		//delete a picture from server	
		$(".deletePicBtn").on('click', function(e) {
		  // $('#deletePicBtn').click(function(e) {
			 var imgName = this.value;
			 EWD.sockets.submitForm({
			
          fields: {
            imgName: imgName
          },
          messageType: 'EWD.form.deletePictures',
		  id : 'deletePicturesForm',
          alertTitle: 'Update Error',
          toastr: {
            target: 'ulisting_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
				//toastr.clear();
			    //toastr.success('Your house pictures has been deleted succesfuly', { timeOut: 4500 });
            }
			
          }
          });
			 
		});
		
	};
	EWD.loadImages = function(messageObj){
		//$('#firstImage').attr("src",messageObj.data.houseId[101].pic[1]);
		
		 $('#ulistingProducts').empty();
		 var html = '<div class="row container-realestate">';
         jQuery.each(messageObj.data.houseId[101].pic, function(val, obj) {
          //html  = '<tr><td>' + obj.name + '</td><td>' + obj.path + '</td>';
          //html += '<td>' + obj.size + '</td><td>' + obj.type + '</td>';
          //html += '<td>' + obj.lastModifiedDate + '</td></tr>';
          
		  <!-- begin:product -->
             
		html +=
			' <div class="col-md-4 col-sm-6 col-xs-12">' +
			'                <div class="property-container">' +
			'                  <div class="property-image" >' +
			'                    <img src= ' + val +  ' alt="mikha real estate theme" id="firstImage">' +
			'                    </div>' +
			'               <div class="property-content">' +
			'	  <input type="checkbox" name="vehicle" value="Car">check to confirm delete' +
			'	  <button type="button" class="deletePicBtn"  value= ' + val + '>Click to delete!</button>' +    
            '      </div>' +
			'                  </div>' +
			'              </div>';
        });
		 $('#ulistingProducts').append(html);
		 
		 EWD.enablePopovers();
	}
	EWD.signIn = function(fullLogin) {
      //$('#ewd-loginPanel-title').text('EWD.js Monitor');

      document.getElementById('email').focus();

      $('#loginPanelBody').keydown(function(event){
        if (event.keyCode === 13) {
          document.getElementById('loginBtn').click();
        }
      });

      $('#loginBtn').click(function(event) {
        event.preventDefault(); // prevent default bootstrap behavior
        var password = '';
        if (fullLogin) password = $('#password').val();
        EWD.sockets.submitForm({
          fields: {
            username: $('#email').val(),
            password: password
          },
		  //after we log in we want to load house and personal details
          messageType: 'EWD.form.login',
          alertTitle: 'Login Error',
          toastr: {
            target: 'signin_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
              EWD.application.loggedIn = true;
			  toastr.success('Welcome !!! ');
			  //EWD.loadListing(messageObj);
			 // EWD.bootstrap3.nav.pageSwap("main_Nav");
			 $('#modal-signin').modal('toggle');
			 EWD.updateNavBar();
            }
          }
        }); 
		
      });

      //$('#loginBtn').show();

    };
	
  EWD.signUp = function() {
      //$('#ewd-loginPanel-title').text('EWD.js Monitor');
      document.getElementById('email').focus();

      $('#signInPanelBody').keydown(function(event){
        if (event.keyCode === 13) {
          document.getElementById('signUpBtn').click();
        }
      });
      $('#signUpBtn').click(function(event) {
        event.preventDefault(); // prevent default bootstrap behavior
        var password = '';
		var confirmPassword ='';
		var userName = '';
		userName = $('#emailS').val();
        password = $('#passwordS').val();
		confirmPassword = $('#confirmPasswordS').val();
        EWD.sockets.submitForm({
          fields: {
            username: userName,
            password: password,
			confirmPassword : confirmPassword
          },
          messageType: 'EWD.form.signUp',
          alertTitle: 'Sign Up Error',
          toastr: {
            target: 'signup_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
              
			  toastr.success('check your email to confirm your registration ', { timeOut: 4500 });
			  
			 // EWD.bootstrap3.nav.pageSwap("main_Nav");
            }
          }
        }); 
      });
      //$('#loginBtn').show();
    };
},

  onPageSwap: {
    // add handlers that fire after pages are swapped via top nav menu
    /* eg:
    about: function() {
      console.log('"about" menu was selected');
    }
    */
  },

  onFragment: {
    // add handlers that fire after fragment contents are loaded into browser
	'navlist.html': function(messageObj) {
	EWD.bootstrap3.nav.enable();
	EWD.initNavbar();
	},
	'main.html': function() {
	
	$('#myFunction').on('click', function(e) {
            EWD.sockets.sendMessage({
              type: 'getSearch',
              criteria: 'all',
			  country: $('#country').val(), 
			  bedroom : $( "#bedroom option:selected" ).text() || '',
			  bathroom : $( "#bathroom option:selected" ).text() || '',
			  type : $( "#type option:selected" ).text() || ''
            });
			// EWD.bootstrap3.nav.pageSwap("single_Nav");
			
          });
	  
	EWD.sockets.sendMessage({
	type: "getLatest",
	params: {
	text: 'latest'
	}
});
	},
	 'signinfrag.html': function(messageObj) {
      EWD.signIn(true);
    },
	'signupfrag.html': function(messageObj) {
      EWD.signUp();
    },
	'logoutfrag.html': function(messageObj) {
	 //
	  $('#logoutBtn').click(function(e) {
		   $('#navbar-username').hide();
			EWD.sockets.sendMessage({
        type: 'EWD.logout'
      });
      });
    },
	'searchfrag.html': function() {
	EWD.sockets.sendMessage({
	type: "getSearch",
	params: {
	text: 'firstPage',
	criteria: 'all'
	}
	});
	 $('#sendMsgBtn').on('click', function(e) {
            EWD.sockets.sendMessage({
              type: 'getSearch',
              criteria: 'all',
			  country: $('#country').val(), 
			  bedroom : $( "#bedroom option:selected" ).text() || '',
			  bathroom : $( "#bathroom option:selected" ).text() || '',
			  type : $( "#type option:selected" ).text() || ''
            });
          });
	$('#singlePageBtn').on('click', function(e) {
            EWD.sockets.sendMessage({
              type: 'getSearch',
              criteria: 'all',
			  country: $('#country').val(), 
			  bedroom : $( "#bedroom option:selected" ).text() || '',
			  bathroom : $( "#bathroom option:selected" ).text() || '',
			  type : $( "#type option:selected" ).text() || ''
            });
			// EWD.bootstrap3.nav.pageSwap("single_Nav");
			
          });
	},
	'singlefrag.html': function() {
		 $('#BackTosinglePageBtn').on('click', function(e) {
          // EWD.bootstrap3.nav.pageSwap("search_Nav");
            });
		    EWD.sockets.sendMessage({
			type: "getSingle",
			params: {
			text: 'single'
			}
			});
	},
	'ulistingfrag.html': function() {
		 $('#SaveListingBtn').on('click', function(e) {
			
		EWD.sockets.submitForm({
          fields: {
            title: $('#property-title').val(),
            bathrooms: $('#property-bathrooms').val(),
			bedrooms : $('#property-bedrooms').val(),
			area : $('#property-area').val(),
			location:$('#property-hLocation').val(),
			description:$('#property-description').val(),
			propertyType: $('input[name=propertyType]:checked', '#saveListingForm').val(),
			carExchange: $('input[name=carExchange]:checked', '#saveListingForm').val(),
			smoking: $('input[name=smoking]:checked', '#saveListingForm').val(),
			pets: $('input[name=pets]:checked', '#saveListingForm').val(),
			children: $('input[name=children]:checked', '#saveListingForm').val(),
			accomodates : $('#property-accomodates').val()
          },
          messageType: 'EWD.form.saveListing',
		  id : 'saveListingForm',
          alertTitle: 'Update Error',
          toastr: {
            target: 'ulisting_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
				toastr.clear();
			  toastr.success('Your listing has been updated succesfuly', { timeOut: 4500 });
            }
          }
        });
            });
	    $('#SaveProfileBtn').on('click', function(e) {
			
		EWD.sockets.submitForm({
          fields: {
            profileName: $('#profile-name').val(),
			groupNo: $('#profile-groupNo').val(),
            adultsNo: $('#profile-adultsNo').val(),
			childrensNo : $('#profile-childrensNo').val(),
			profileTitle : $('#profile-title').val(),
			profileDesc:$('#profile-desc').val()
          },
          messageType: 'EWD.form.saveProfile',
		  id : 'saveProfileForm',
          alertTitle: 'Update Error',
          toastr: {
            target: 'ulisting_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
				toastr.clear();
			  toastr.success('Your profile has been updated succesfuly', { timeOut: 4500 });
            }
          }
        });
            });
		$('#upLoadReset').click(function(e) {
      e.preventDefault();
      $('#upLoadSend').hide();
    });

    $('#upLoadFile').change(function(e) {
      e.preventDefault();
      var files = this.files;
      // console.log('--- files = \n', files);
      if (files.length>0) {
        $('#upLoadSend').show();
      } else {
        $('#upLoadSend').hide();
      }
    });	

		//delete a picture from server	
		/*$(".deletePicBtn").on('click', function(e) {
		  // $('#deletePicBtn').click(function(e) {
			 var imgName = this.value;
			 EWD.sockets.submitForm({
			
          fields: {
            imgName: imgName
          },
          messageType: 'EWD.form.deletePictures',
		  id : 'deletePicturesForm',
          alertTitle: 'Update Error',
          toastr: {
            target: 'ulisting_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
				//toastr.clear();
			    //toastr.success('Your house pictures has been deleted succesfuly', { timeOut: 4500 });
            }
			
          }
          });
			 
		});*/
		//delete selected pictures from server. guy
	    /*$('#DeletePicturesBtn').on('click', function(e) {
			
		EWD.sockets.submitForm({
			
          fields: {
            profileName: $('#profile-name').val(),
			groupNo: $('#profile-groupNo').val(),
            adultsNo: $('#profile-adultsNo').val(),
			childrensNo : $('#profile-childrensNo').val(),
			profileTitle : $('#profile-title').val(),
			profileDesc:$('#profile-desc').val()
          },
          messageType: 'EWD.form.deletePictures',
		  id : 'deletePicturesForm',
          alertTitle: 'Update Error',
          toastr: {
            target: 'ulisting_Container'
          },
          done: function(messageObj) {
            if(messageObj.ok) {
				//toastr.clear();
			    //toastr.success('Your house pictures has been deleted succesfuly', { timeOut: 4500 });
            }
			
          }
        });
            });	*/	
	},
	'testfrag.html': function() {
		 $('#testBtn').on('click', function(e) {
            EWD.sockets.sendMessage({
              type: 'testDB',
              criteria: 'all',
			  country: $('#country').val(), 
			  bedroom : $( "#bedroom option:selected" ).text() || '',
			  bathroom : $( "#bathroom option:selected" ).text() || ''
            });
          });
		  
	 /* start of from ewdUpLoad */
	$('#upLoadReset').click(function(e) {
      e.preventDefault();
      $('#upLoadSend').hide();
    });

    $('#upLoadFile').change(function(e) {
      e.preventDefault();
      var files = this.files;
      // console.log('--- files = \n', files);
      if (files.length>0) {
        $('#upLoadSend').show();
      } else {
        $('#upLoadSend').hide();
      }
    });
	///delete files in server. guy
	/*$('#deleteFilesForm').submit(function(e) {
      e.preventDefault();
	    EWD.sockets.sendMessage({
        type : 'fileUpLodeDelete',  params: {
			fileName: 'rc30',
			fileName2: 'img01'
		},
        done: function(messageObj) {
			   console.log('----- success files delete!');
		 }  // End of Done by fileDelete
      });  // End of EWD.sockets.sendMessage fileDelete
      
    });*/
    // Start upLoad Server -> Send files -> Close upLoad Server
    $('#upLoadForm').submit(function(e){
      e.preventDefault();
      EWD.sockets.sendMessage({
        type : 'fileUpLodeListen',  params: {},
        done: function(messageObj) {
          if(messageObj.message.upserver){
            var port = messageObj.message.uploadPort;
            var upLoadUrl  = messageObj.message.uploadUrl;
            console.log('----- Start Listen upLoad Server port No:' + port);
            EWD.application.setStatus(true);
            var fd = new FormData($('#upLoadForm').get(0));
            // Send files by $.ajax
            $.ajax({
                url: 'http://' + location.hostname + ':' + port + '/' + upLoadUrl,
                type: 'POST',
                data: fd,
                processData: false,
                contentType: false,
                dataType: 'json'
              })
              .done(function( data ) {
                console.log('----- success files upLoad!');
                EWD.application.setStatus(false);
                EWD.sockets.sendMessage({ type : 'fileUpLodeUnref', params: {} });
				EWD.sockets.sendMessage({ type : 'fileImageRefresh', params: {} });
                toastr.success('upload Success');
              })
              .fail(function( jqXHR, textStatus, errorThrown ) {
                EWD.application.setStatus(false);
                EWD.sockets.sendMessage({ type : 'fileUpLodeUnref', params: {} });
                toastr.error('upload Error' + textStatus);
              });
              // End of $.ajax
          }  // End of if upserver
          $('#upLoadReset').click();
        }  // End of Done by fileUpLodeListen
      });  // End of EWD.sockets.sendMessage fileUpLodeListen
    });  // End of submit
	/* end of from ewdUpLoad */
	}
  },

  onMessage: {
	  
	  //####start taken from file upload
	upLoadList: function(messageObj) {
      var html ;
      if (messageObj.message.upload) {
        $('#upLoadListTable tbody').empty();
        jQuery.each(messageObj.message.upload, function(val, obj) {
          html  = '<tr><td>' + obj.name + '</td><td>' + obj.path + '</td>';
          html += '<td>' + obj.size + '</td><td>' + obj.type + '</td>';
          html += '<td>' + obj.lastModifiedDate + '</td></tr>';
          $('#upLoadListTable tbody').append(html); 
        });
      }
    },
    fileUpLodeUnref: function(messageObj){
      if(!messageObj.message.upserver){
        console.log('----- Close upLoad Server');
      }
    },
	//message from server that says if deletion went o.k. guy
	deletePictures : function(messageObj){
      if(!messageObj.ok){
        console.log('----- error deleting picture' + messageObj.error.path + " " + messageObj.error.code);
		//toastr.clear();
	    toastr.error('----- error deleting picture' + messageObj.error.path + " " + messageObj.error.code, { timeOut: 4500 });
      }
	   if(messageObj.ok) {
		   
			//toastr.clear();
		    toastr.success('Your house pictures has been deleted succesfuly', { timeOut: 4500 });
	   }
    },
	//####end taken from file upload
	//refresh images after we delete an imagen from server
	 refreshImages: function(messageObj){
       EWD.loadImages(messageObj);
    },
    // add handlers that fire after JSON WebSocket messages are received from back-end
	getSingle : function(messageObj) {
		var accomodate = messageObj.message.accomodate;
		var area = messageObj.message.area;
		var carExchange = messageObj.message.carExchange;
		var delegateNo = messageObj.message.delegateNo;
		var desc = messageObj.message.desc.body;
		var headline = messageObj.message.desc.headline;
		var location = messageObj.message.location.desc;
		var pic = messageObj.message.pic.main;
		var ownerImage = 'team01.jpg';
		var ownerName = 'Test Name Familly';
		var id =4;
		var type = messageObj.message.type;
		var areaType = messageObj.message.areaType;
		
		var html = '<div id="myTabContent" class="tab-content">'+
'                  <div class="tab-pane fade in active" id="detail">'+
'                    <div class="row">'+
'                      <div class="col-md-12">'+
'                        <h2>' + headline + '</h2>'+
'                        <div id="slider-property" class="carousel slide" data-ride="carousel">'+
'                          <ol class="carousel-indicators">'+
'                            <li data-target="#slider-property" data-slide-to="0" class="">'+
'                              <img src=img/' + pic + ' alt="">'+
'                            </li>'+
'                            <li data-target="#slider-property" data-slide-to="1" class="active">'+
'                              <img src="img/img03.jpg" alt="">'+
'                            </li>'+
'                            <li data-target="#slider-property" data-slide-to="2">'+
'                              <img src="img/img04.jpg" alt="">'+
'                            </li>'+
'                          </ol>'+
'                          <div class="carousel-inner">'+
'                            <div class="item">'+
'                              <img src="img/img02.jpg" alt="">'+
'                            </div>'+
'                            <div class="item active">'+
'                              <img src="img/img03.jpg" alt="">'+
'                            </div>'+
'                            <div class="item">'+
'                              <img src="img/img04.jpg" alt="">'+
'                            </div>'+
'                          </div>'+
'                          <a class="left carousel-control" href="#slider-property" data-slide="prev">'+
'                            <span class="glyphicon glyphicon-chevron-left"></span>'+
'                          </a>'+
'                          <a class="right carousel-control" href="#slider-property" data-slide="next">'+
'                            <span class="glyphicon glyphicon-chevron-right"></span>'+
'                          </a>'+
'                        </div>'+
'                        <h3>House Overview</h3>'+
'                        <table class="table table-bordered">'+
'                          <tr>'+
'                            <td width="20%"><strong>ID</strong></td>'+
'                            <td>#' + id + '</td>'+
'                          </tr>'+
'                          <tr>'+
'                            <td><strong>Accomodates</strong></td>'+
'                            <td>' + accomodate + '</td>'+
'                          </tr>'+
'                          <tr>'+
'                            <td><strong>Type & Area</strong></td>'+
'                            <td>' + type + '  ' + areaType + '</td>'+
'                          </tr>'+
'                          <!--tr>'+
'                            <td><strong>Contract</strong></td>'+
'                            <td>Sale</td>'+
'                          </tr-->'+
'                          <tr>'+
'                            <td><strong>Location</strong></td>'+
'                            <td>' + location +'</td>'+
'                          </tr>'+
'                          <tr>'+
'                            <td><strong>Bathrooms</strong></td>'+
'                            <td>4</td>'+
'                          </tr>'+
'                          <tr>'+
'                            <td><strong>Bedrooms</strong></td>'+
'                            <td>4</td>'+
'                          </tr>'+
'                          <tr>'+
'                            <td><strong>Area</strong></td>'+
'                            <td>' + area + 'm<sup>2</sup> </td>'+
'                          </tr>'+
'                        </table>'+
'                        <h3>House Features</h3>'+
'                        <div class="row">'+
'                          <div class="col-md-4 col-sm-4">'+
'                            <ul>'+
'                              <li><i class="fa fa-check"></i> Air conditioning</li>'+
'                              <li><i class="fa fa-check"></i> Balcony</li>'+
'                              <li><i class="fa fa-times"></i> Bedding</li>'+
'                              <li><i class="fa fa-check"></i> Cable TV</li>'+
'                              <li><i class="fa fa-times"></i> Cleaning after exit</li>'+
'                              <li><i class="fa fa-check"></i> Cofee pot</li>'+
'                              <li><i class="fa fa-check"></i> Computer</li>'+
'                              <li><i class="fa fa-times"></i> Cot</li>'+
'                            </ul>'+
'                          </div>'+
'                          <div class="col-md-4 col-sm-4">'+
'                            <ul>'+
'                              <li><i class="fa fa-check"></i> Internet</li>'+
'                              <li><i class="fa fa-times"></i> Iron</li>'+
'                              <li><i class="fa fa-check"></i> Juicer</li>'+
'                              <li><i class="fa fa-times"></i> Lift</li>'+
'                              <li><i class="fa fa-times"></i> Microwave</li>'+
'                              <li><i class="fa fa-check"></i> Oven</li>'+
'                              <li><i class="fa fa-times"></i> Parking</li>'+
'                              <li><i class="fa fa-times"></i> Parquet</li>'+
'                            </ul>'+
'                          </div>'+
'                          <div class="col-md-4 col-sm-4">'+
'                            <ul>'+
'                              <li><i class="fa fa-times"></i> Radio</li>'+
'                              <li><i class="fa fa-check"></i> Roof terrace</li>'+
'                              <li><i class="fa fa-times"></i> Smoking allowed</li>'+
'                              <li><i class="fa fa-check"></i> Terrace</li>'+
'                              <li><i class="fa fa-times"></i> Toaster</li>'+
'                              <li><i class="fa fa-check"></i> Towelwes</li>'+
'                              <li><i class="fa fa-check"></i> Use of pool</li>'+
'                              <li><i class="fa fa-check"></i> Video</li>'+
'                            </ul>'+
'                          </div>                          '+
'                        </div>'+
''+
'                        <h3>Property Description</h3>'+
'                        <p>' + desc + '.</p>'+
'						<!-- test guy -->'+
'                        <div class="row">'+
'                          <div class="col-md-12">'+
'                           <div id="map-property"></div>'+
'                          </div>'+
'                         </div>'+
'						<div class="form-group">'+
'						<label for="maxprice"> </label>'+
'						<input type="submit"  name="submit" value="Back to search Page" class="btn btn-warning btn-block"  id="BackTosinglePageBtn">'+
'						</div>'+
'						<!-- end test guy -->'+
'                      </div>'+
'                    </div>'+
''+
'                    '+
'                  </div>'+
'                  <!-- break -->'+
'                  <div class="tab-pane fade" id="location">'+
'                    <!--div class="row">'+
'                      <div class="col-md-12">'+
'                        <div id="map-property"></div>'+
'                      </div>'+
'                    </div-->'+
'                    <div class="row">'+
'                      <div class="col-md-12">'+
'                        <h3>Owner Details</h3>'+
'                      </div>'+
'                    </div>'+
'                    <div class="row">'+
'                      <div class="col-md-6 col-sm-6">'+
'                        <div class="team-container team-dark">'+
'                          <div class="team-image">'+
'                            <img src=img/' + ownerImage + ' alt="">'+
'                          </div>'+
'                          <div class="team-description">'+
'                            <h3>' + ownerName + '</h3>'+
'                            <p><i class="fa fa-phone"></i> Office : 021-234-5678<br>'+
'                            <i class="fa fa-mobile"></i> Mobile : +62-3456-78910<br>'+
'                            <i class="fa fa-print"></i> Fax : 021-234-5679</p>'+
'                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod'+
'                            tempor incididunt ut labore et dolore magna aliqua.</p>'+
'                            <div class="team-social">'+
'                              <span><a href="#" title="Twitter" rel="tooltip" data-placement="top"><i class="fa fa-twitter"></i></a></span>'+
'                              <span><a href="#" title="Facebook" rel="tooltip" data-placement="top"><i class="fa fa-facebook"></i></a></span>'+
'                              <span><a href="#" title="Google Plus" rel="tooltip" data-placement="top"><i class="fa fa-google-plus"></i></a></span>'+
'                              <span><a href="#" title="Email" rel="tooltip" data-placement="top"><i class="fa fa-envelope"></i></a></span> '+
'                              <span><a href="#" title="LinkedIn" rel="tooltip" data-placement="top"><i class="fa fa-linkedin"></i></a></span> '+
'                            </div>                       '+
'                          </div>'+
'                        </div>'+
'                      </div>'+
'                      <div class="col-md-6 col-sm-6">'+
'                        <form>'+
'                          <!--div class="form-group">'+
'                            <label for="name">Name</label>'+
'                            <input type="text" class="form-control input-lg" placeholder="Enter name : ">'+
'                          </div>'+
'                          <div class="form-group">'+
'                            <label for="email">Email address</label>'+
'                            <input type="email" class="form-control input-lg" placeholder="Enter email : ">'+
'                          </div>'+
'                          <div class="form-group">'+
'                            <label for="telp">Telp.</label>'+
'                            <input type="text" class="form-control input-lg" placeholder="Enter phone number : ">'+
'                          </div-->'+
'                          <div class="form-group">'+
'                            <label for="message">Message</label>'+
'                            <textarea class="form-control input-lg" rows="7" placeholder="Type a message : "> </textarea>' +
'                          </div>' +
'                          <div class="form-group">' +
'                            <input type="submit" name="submit" value="Send Message" class="btn btn-warning btn-lg">' +
'                          </div>' +
'						 </form>';
	$('#myTabContent').html(html);
	},
	login:function(messageObj){
		EWD.loadListing(messageObj);
	},
  latestRealEstate: function(messageObj) {
	toastr.clear();
	toastr.info('Message received ' );
	var propertyHeader = "מגורים";
	var location = '';
	var descBody='',image='';
	var html = '<div class="row">';
	for (var i = 0; i < messageObj.results.length; i++) {
		 email = messageObj.results[i].email;
		 houseId = messageObj.results[i].houseId;
		 propertyHeader = messageObj.results[i].headline;
		 location = messageObj.results[i].location;
		 descBody = messageObj.results[i].bodydesc;
		 area = messageObj.results[i].area;
		 delegateNo =messageObj.results[i].delegateNo;
		 carExchange = messageObj.results[i].carExchange;
		 accomodate = messageObj.results[i].accomodate;
		 image = messageObj.results[i].image;
	html = html +  '<div class="col-md-4 col-sm-4 col-xs-12">'+
'            <div class="property-container">'+
'              <div class="property-image">'+
'                <img src="img/' + image + '" alt="arillo real estate theme"  onclick="myFunction()">'+
'                <div class="property-price">'+
'                   <h4>' + propertyHeader + '</h4>'+
'                  <span>$800,000</span>'+
'                </div>'+
'              </div>'+
'              <div class="property-content">'+
'                <h3><a href="#">' + propertyHeader + '</a> <small>' + location + '</small></h3>'+
'                <p>' + descBody + '</p>'+
'              </div>'+
'              <div class="property-features">'+
'                <span><i class="fa fa-home" data-toggle="tooltip" data-placement="left" title="" data-original-title="house size is ' + area + ' square meters"></i> ' + area + ' m<sup>2</sup></span>'+
'                <span><i class="fa fa-hdd-o" data-toggle="tooltip" data-placement="left" title="" data-original-title="accomodates ' + accomodate + ' persons"></i>  ' + " " + accomodate + '</span>'+
'                <span><i class="fa fa-male" data-toggle="tooltip" data-placement="left" title="" data-original-title="' + delegateNo + ' travelers"></i>  ' +delegateNo + '</span>'+
'                <span><i class="fa fa-car" data-toggle="tooltip" data-placement="left" title="" data-original-title="car exchange ' + carExchange + '"></i>  ' + carExchange + '</span>'+
'                <input type="submit"  name="submit" value="Single Page" class="btn btn-warning btn-block"  id="singlePageBtn1"> ' +
'              </div>'+
'            </div>'+
'          </div>';
	

	}

	html = html + '</div>';
	html = html + '</div>';
	$('#latestHouses').html(html);
	 
	$('[data-toggle="tooltip"]').tooltip();
  },
  searchResults: function(messageObj) {
	toastr.clear();
	toastr.info('Message received ' );
	var propertyHeader = "!!! מגורים";
	var html = '<div class="row">';
	for (var i = 0; i < 6; i++) {
	html = html + '<div class="col-md-3 col-sm-6 col-xs-12">'+
'            <div class="property-container">'+
'              <div class="property-image">'+
'                <img src="img/img02.jpg" alt="arillo real estate theme">'+
'                <div class="property-price">'+
'                  <h4>' + propertyHeader + '</h4>'+
'                  <span>$800,000</span>'+
'                </div>'+
'                <div class="property-status">'+
'                  <span>For Sale !!!</span>'+
'                </div>'+
'              </div>'+
'              <div class="property-features">'+
'                <span><i class="fa fa-home"></i> 5,000 m<sup>2</sup></span>'+
'                <span><i class="fa fa-hdd-o"></i> 2 Bed</span>'+
'                <span><i class="fa fa-male"></i> 2 Bath</span>'+
'              </div>'+
'              <div class="property-content">'+
'                <h3><a href="#">The Urban Life</a> <small>22, JJ Road, Yogyakarta</small></h3>'+
'              </div>'+
'            </div>'+
'          </div>';
	}
	html = html + '</div>';
	 $('#products').html(html);
  },
  /*savedListing: function (messageObj) {
	toastr.clear();
	//toastr.info('Listing Saved' );
	toastr.success('Listing Saved', { timeOut: 4500 });
	
	  },*/
  dbResults: function(messageObj) {
	toastr.clear();
	toastr.info('Message received ' );
	var propertyHeader = "!!! מגורים";
	var text = 'Email: ' + JSON.stringify(messageObj.email);;
	document.getElementById('textarea1').innerHTML = text;
	  },
  testDB: function(messageObj) {
	//var text = 'Email: ' + JSON.stringify(messageObj.message,null,3);
	//var email = messageObj.message.email;
	//var address = messageObj.message.houseId[101].location.desc;
	//var text = 'Email: ' + email + 'Address: ' + address;
	var email='';
	var houseId='';
	var text='';
	//document.getElementById('textarea1').innerHTML = JSON.stringify(messageObj.message,null,3);
	 for (var i = 0; i < messageObj.message.results.length; i++) {
		 email = messageObj.message.results[i].email;
		 houseId = messageObj.message.results[i].houseId;
		 text = text + email + " " + houseId;
	 }
	 document.getElementById('textarea1').innerHTML = text;
	  },  
  searchResultsTest: function(messageObj) {
	toastr.clear();
	toastr.info('Message received ' );
	var propertyHeader = "בדיקה מגורים";
	var html = '<div class="row">';
	for (var i = 0; i < 6; i++) {
	html = html + '<div class="col-md-3 col-sm-6 col-xs-12">'+
'            <div class="property-container">'+
'              <div class="property-image">'+
'                <img src="img/img02.jpg" alt="arillo real estate theme">'+
'                <div class="property-price">'+
'                  <h4>' + propertyHeader + '</h4>'+
'                  <span>$800,000</span>'+
'                </div>'+
'                <div class="property-status">'+
'                  <span>For Sale !!!</span>'+
'                </div>'+
'              </div>'+
'              <div class="property-features">'+
'                <span><i class="fa fa-home"></i> 5,000 m<sup>2</sup></span>'+
'                <span><i class="fa fa-hdd-o"></i> 2 Bed</span>'+
'                <span><i class="fa fa-male"></i> 2 Bath</span>'+
'              </div>'+
'              <div class="property-content">'+
'                <h3><a href="#">The Urban Life</a> <small>22, JJ Road, Yogyakarta</small></h3>'+
'              </div>'+
'            </div>'+
'          </div>';
	}
	html = html + '</div>';
	 $('#products').html(html);
  }
	}
 

};

//##########start taken from file upload
/* commented because causing Ext not defined. guy EWD.onSocketsReady = function() {
    for (id in EWD.application.labels) {
        try {
            document.getElementById(id).innerHTML = EWD.application.labels[id];
        }
        catch(err) {}
    };
    if (EWD.application.onStartup) EWD.application.onStartup();
};
EWD.onSocketMessage = function(messageObj) {
    if (EWD.application.messageHandlers) EWD.application.messageHandlers(messageObj);
}; */
//##########end taken from file upload








