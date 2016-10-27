/* from ewdUpLoad.js */
var fs = require('fs');
var crypto = require('crypto');

var password = {
  encrypt: function(password) {
    if (!password || password === '') return {error: 'Missing or invalid password'};
    var salt = crypto.randomBytes(64);
    var iterations = 10000;
    var keyLength = 64;
    var encrypted = crypto.pbkdf2Sync(password, salt, iterations, keyLength);
    return {
      type: 'password',
      hash: encrypted.toString('base64'),
      salt: salt.toString('base64')
    };
  },
  matches: function(fromUser, credentials) {
    var iterations = 10000;
    var keyLength = 64;
    var salt = new Buffer(credentials.salt, 'base64');
    var encrypted = crypto.pbkdf2Sync(fromUser, salt, iterations, keyLength);
    encrypted = encrypted.toString('base64');
    if (credentials.hash === encrypted) return true;
    return false;
  }
};

// files upLoad
var http = require('http'),
    util = require('util'),
    formidable = require('formidable'),
    upserver;

//var baseDir = '/tmp/ewdupload';   // upload base directory
//var baseDir = '/home/guy/pictures';   // upload base directory
var baseDir = '/home/guy/ewdjs/www/ewd/homeEx/img';
var uploadPort;                   // port number
var uploadUrl;                    // upload URL

var upLoadStart = function(ewd) {

  var sessid  = ewd.session.sessid;
  var hashObj = password.encrypt('ewdupload' + sessid.toString()) ;
  uploadUrl   = escape(hashObj.hash);
  uploadPort  = Math.floor((Math.random()*1000)+10000);

  var upList = new ewd.mumps.GlobalNode('%zewdUpLoad', ['session', sessid]);

  var uploadDir = baseDir + '/' + '101'; //ewd.session.sessid ;
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  upserver = http.createServer();
  upserver.listen(uploadPort);

  upserver.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('******* : ' + uploadPort + ' : port in use Now , port = port + 1 trying...');
      upserver.close();
      uploadPort = uploadPort + 1;
      upserver.listen(uploadPort);
    }
  });

  upserver.on('listening',function(){
    console.log('******* Start listening upLoad server http://localhost:' + uploadPort + '/' + uploadUrl );
    ewd.sendWebSocketMsg({ 
      type: 'fileUpLodeListen', 
      message: {
         upserver: true,
         uploadPort: uploadPort,
         uploadUrl: uploadUrl
      }
    });
  });

  upserver.on('request', function(req, res) {

      var reqIP = req.connection.remoteAddress;
      var ewdIP = ewd.ipAddress;

      if ( (req.url == '/' + uploadUrl) && (req.method.toLowerCase() == 'post') && (reqIP == ewdIP) ) {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = uploadDir;
        form.parse(req, function(err, fields, files) {
          console.log('******* UpLoad Success Files=\n', files, '\nError=', err, '\nfields=', fields );
          res.writeHead(200, { 'content-type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
          res.end( JSON.stringify( {fields: fields, files: files} ));
		  
		  var home = new ewd.mumps.GlobalNode('homeEx', ['1',"houseId",'101',"pic"]);
			
          if (typeof files.upload.length == 'number') {
            for(var i=0; i < files.upload.length; i++){
              var upload = {
                size: files.upload[i].size,   path: files.upload[i].path,
                name: files.upload[i].name,   type: files.upload[i].type,
                lastModifiedDate: files.upload[i].lastModifiedDate.toLocaleString()
              };
              upList.$(files.upload[i].path)._setDocument(upload);
			  //save file names that were uploaded to mumps database
		      home.$(files.upload[i].path)._setDocument(upload);  //guy
            }
          } else {
              // console.log('********* only one file =',files);
              var upload = {
                size: files.upload.size,   path: files.upload.path,
                name: files.upload.name,   type: files.upload.type,
                lastModifiedDate: files.upload.lastModifiedDate.toLocaleString()
              };
              upList.$(files.upload.path)._setDocument(upload);
			//save file names that were uploaded to mumps database
		      home.$(files.upload.path)._setDocument(upload);  //guy
          }
         // ewd.sendWebSocketMsg({ type: 'upLoadList',  message: { upload : upList._getDocument() } });
		 

        });
      } else {
        console.log('*******  UpServer error URL: /' + uploadUrl );
        console.log('*******  UpServer error reqest Method: ' + req.method);
        console.log('*******  UpServer error reqest IP: ' + reqIP);
        console.log('*******  UpServer error ewd IP: ' + ewdIP);
        res.writeHead(404, { 'content-type': 'text/plain' , 'Access-Control-Allow-Origin': '*' });
        res.end('404');
      }
  });
};
var upLoadUnref = function(ewd) {
    upserver.close();
    upserver.unref();
    console.log('**************** Unref upLoad Server on http://localhost:' + uploadPort + '/');
    ewd.sendWebSocketMsg({ type: 'fileUpLodeUnref', message: { upserver: false } });
};
var fileDelete = function(ewd) {
  var baseDir = '/home/guy/pictures';   // upload base directory
    console.log('****************deleting file from server');
	console.log("Going to delete an existing file");
	fs.unlink(baseDir + 'rc30', function(err) {
    if (err) {
       console.error(err);
   }
   console.log("File deleted successfully!");
});
   //ewd.sendWebSocketMsg({ type: 'fileUpLodeUnref', message: { upserver: false } });
};
var imageRefresh = function(ewd) {
  var details = new ewd.mumps.GlobalNode('homeEx', ["1"]);
			var data = details._getDocument();	
			ewd.sendWebSocketMsg({
                  type: 'refreshImages',
				  data : data,
                  ok: true
                });
};
var deletePicFromMumps = function(ewd,fileName){
	console.log('****************deleting file name from mumps');
	var pic = new ewd.mumps.GlobalNode('homeEx', ['1',"houseId",'101',"pic"]);
	/*pics._forEach(function(subscript, subNode) {
	  
      if (subNode._hasValue) value = subNode._value;
    
     if (value === fileName)
	 {
		 
		 subNode._delete();
	 }
      //console.log(id + ': ' + value);
	 
	 }); */
	 pic.$(fileName)._delete();
};
/* end from ewdUpLoad.js */

module.exports = {
onMessage: {
	/*from ewdUpLoad.js*/
fileUpLodeListen: function(params, ewd) { upLoadStart(ewd); },
fileUpLodeUnref: function(params, ewd)  { upLoadUnref(ewd); },
fileUpLodeDelete: function(params, ewd)  { fileDelete(ewd); },
fileImageRefresh: function(params, ewd)  { imageRefresh(ewd); },
	/*end from ewdUpLoad.js*/
sendHelloWorld: function(params, ewd) {
var wsMsg = params;
var savedMsg = new ewd.mumps.GlobalNode('AMessage', []);
savedMsg._setDocument(params);
return {savedInto: 'AMessage'};
},
getSingle : function(params, ewd) {
 var bodydesc='';
 var houseId="1";
 var headline="";
 var location="";
 var image="";
 var area='',delegateNo='',carExchange='',accomodate='';
 var results='';
 var home = new ewd.mumps.GlobalNode('homeEx', [4,"houseId",104]);
 
 return home._getDocument();
 
},

'EWD.form.login': function(params, ewd) {    
    if (params.username === '') return 'You must enter a username (email)';
	if (params.password === '') return 'You must enter a password';
	var auth = new ewd.mumps.GlobalNode('homeExU', [params.username,"pass"]);
	if (!auth._hasValue) return 'No such user';
	if (auth._value != params.password) return 'Invalid login attempt';
	ewd.session.setAuthenticated();
	//load hose and personal details
	var details = new ewd.mumps.GlobalNode('homeEx', ["1"]);
	var data = details._getDocument();
	 ewd.sendWebSocketMsg({
                  type: 'login',
			      propertyType : 'Suburbs',
                  propertyAccomodates: '1',
				  data : data,
                  ok: true
                });
	return '';  
    },
'EWD.form.signUp': function(params, ewd) {    
    if (params.username === '') return 'You must enter a username (email)';
	if (params.password === '') return 'You must enter a password';
	if (params.password != params.confirmPassword) return 'Password and confirm passworm do not match';
	var auth = new ewd.mumps.GlobalNode('homeExU', [params.username,"pass"]);
	if (auth._hasValue) return 'Such user already exists';
	auth._value = params.password;
	auth.$('status')._value = 0;  //when we first sign in status is 0
	return '';  
    },	
'EWD.form.saveListing': function(params, ewd) {
	try{
    if (params.title === '') return 'Give your home a title please';
	if (params.location === '') return 'Give your home a location please';
	var home = new ewd.mumps.GlobalNode('homeEx', ['1',"houseId",'101']);
	home.$('area')._value = params.area;
	home.$('location').$('desc')._value = params.location;
	home.$('desc').$('headline')._value = params.title;
	home.$('bathrooms')._value = params.bathrooms;
	home.$('bedrooms')._value = params.bedrooms;
	home.$('desc').$('body')._value = params.description;
	home.$('type')._value = params.propertyType;
	home.$('carExchange')._value = params.carExchange;	
	home.$('houseRules').$('smoking')._value = params.smoking;		
	home.$('houseRules').$('pets')._value = params.pets;
	home.$('houseRules').$('children')._value = params.children;	
	}
	catch (err)
	{
		return err.message;
	}
	/* ewd.sendWebSocketMsg({
          type: 'savedListing',
          ok: true,
          
        });*/
	return  '';  
    },
'EWD.form.saveProfile': function(params, ewd) {    
	try{
    if (params.profileName === '') return 'Give a name to your profile please';
	if (params.adultsNo === '') return 'Select number of adults in your group please';
	if (params.profileTitle === '') return 'Give a title to your profile please';
	if (params.profileDesc === '') return 'Give a description to your profile please';
	if (params.groupNo === '') return 'Select number of people in your group please';
	var profile = new ewd.mumps.GlobalNode('homeEx', ['1',"profile"]);
	profile.$('profileName')._value = params.profileName;
	profile.$('adultsNo')._value = params.adultsNo;
	profile.$('profileTitle')._value = params.profileTitle;
	profile.$('profileDesc')._value = params.profileDesc;
	profile.$('childrensNo')._value = params.childrensNo;
	profile.$('groupNo')._value = params.groupNo;
	}
	catch(err)
	{
		return err.message;
	}
	return  '';  
    },
/*'EWD.form.deletePictures': function(params, ewd) {    
	var baseDir = '/home/guy/ewdjs/www/ewd/homeEx/img/'; 
    console.log('****************deleting file from server');
	console.log("Going to delete an existing file");
	fs.unlink(baseDir + 'rc30', function(err) {
      if (err) {
        console.error(err);
		return "error deleting files" + err.message;
      }
     console.log("File deleted successfully!");
	  });
	return  ''; 
    },*/
'EWD.form.deletePictures': function(params, ewd) {   
	/*var imgName = params.imgName;
	var dirName = '/home/guy/ewdjs/www/ewd/homeEx/img/101';
	var fileName = dirName + imgName;*/
	var fileName = params.imgName;
	//console.log(__dirname);
	//'/home/guy/ewdjs/www/ewd/homeEx/img/rc30'
	//"/home/guy/ewdjs/node_modules"  here we are when homeEx.js run
	fs.stat(fileName, function (err, stats) {
   console.log(stats);//here we got all information of file in stats variable
   if (err) {
	   console.error(err);
       ewd.sendWebSocketMsg({
		   toastr: {
            target: 'ulisting_Container'
          },
                  type: 'deletePictures',
			      error : err,
                  ok: false
                });
	return;
   }
     fs.unlink(fileName,function(err){	
        if(err){
		ewd.sendWebSocketMsg({
					toastr: {
            target: 'ulisting_Container'
          },
                  type: 'deletePictures',
			      error : err,
                  ok: false
                });
		} 
		else {
			deletePicFromMumps(ewd,fileName);
			ewd.sendWebSocketMsg({
					toastr: {
            target: 'ulisting_Container'
          },
                  type: 'deletePictures',
                  ok: true
                });
			var details = new ewd.mumps.GlobalNode('homeEx', ["1"]);
			var data = details._getDocument();	
			ewd.sendWebSocketMsg({
                  type: 'refreshImages',
				  data : data,
                  ok: true
                });
			
		}
        console.log('file deleted successfully');
   });  
});
	//return  ''; 
    },
getLatest: function(params, ewd) {
var home = new ewd.mumps.GlobalNode('homeEx', []);
 var results = [];
 var email="";
 var bodydesc='';
 var houseId="";
 var headline="";
 var location="";
 var image="";
 var area='',delegateNo='',carExchange='',accomodate='';
  var homeById = {};
  var max = 10;
  var i = 0;
home._forEach(function(subscript, subNode) {
	  i++;
	  if (i>10) return true;
      if (subscript > 10) return true;
	  var value = 'intermediate node';
      if (subNode._hasValue) value = subNode._value;
      //console.log(subscript + ': ' + value);
	 subNode._forEach(function(id,subNode1) {
	 
	  var value = 'intermediate node';
      if (subNode1._hasValue) value = subNode1._value;
      //console.log(id + ': ' + value);
	   subNode1._forEach(function(id1,subNode2){
		    var value = 'intermediate node';
            if (id1._hasValue) value = id1._value;
           // console.log(id1 + ': ' + value);
			//
			email = subNode.email._value;
			houseId = id1;
			headline = subNode2.$('desc').$('headline')._value;
			bodydesc = subNode2.$('desc').$('body')._value;
			bodydesc = bodydesc.substr(0,130)+ "...";
			location = subNode2.$('location').$('desc')._value;
			image = subNode2.$('pic').$('main')._value;
			area = subNode2.$('area')._value;
			delegateNo = subNode2.$('delegateNo')._value;
			carExchange = subNode2.$('carExchange')._value;
			accomodate = subNode2.$('accomodate')._value;
			console.log("email " + ': ' + email + " houseId :" + houseId + " headline : " + headline + " location " + location + " image " + image );
			//
		  results.push({
           email: email, 
           houseId: houseId,
		   headline : headline,
		   location : location,
		   image : image,
		   bodydesc :bodydesc,
		   area : area,
		   delegateNo :delegateNo,
		   carExchange : carExchange,
		   accomodate : accomodate
	         });
      
      });
     // homeById[id] = subscript;
		 
   });
});	  
ewd.sendWebSocketMsg({
 type: 'latestRealEstate',
 results: results

});
},
getSearch: function(params, ewd) {
	var message = [];
  var savedMsg = new ewd.mumps.GlobalNode('AMessage', []);
  var patient= new ewd.mumps.GlobalNode("home", ['1']);
  var patientRec0 = patient._value;
  var patientObj = patientRec0.split('^');
  for (i = 0; i < 1; i++) { 
  message.push({
		fName: patientObj[0],
		lName: patientObj[1],
		//age: patientObj[2],
		age: i,
		city: patientObj[3],
		street: patientObj[4],
		pic : ""
          });
  }
		  
ewd.sendWebSocketMsg({
type: 'searchResults',
message: message

});
return {messageRetrieved: true};
},
getPatientsByPrefix: function(params, ewd) {
// optional: for convenience I usually break out the constituent parts of the ewd object
var sessid = ewd.session.$('ewd_sessid')._value; // the user’s EWD.js session id
console.log('getPatientsByPrefix: ' + JSON.stringify(params));
var matches = [];
if (params.prefix === '') return matches;
var index = new ewd.mumps.GlobalNode('CLPPatIndex', ['lastName']);
index._forPrefix(params.prefix, function(name, subNode) {
subNode._forEach(function(id, subNode2) {
matches.push({name: subNode2._value, id: id});
});
});
return matches; // returns a response websocket message to the user’s browser.
// The returned message has the same type, ‘getPatientsByPrefix’ in
// this example. The JSON payload for a returned message is in the
// “message” property, so the browser’s handler for this message response
// will extract the matches in the example above by accessing:
// messageObj.message
},
testDB1: function(params, ewd) {
  var emailNode= new ewd.mumps.GlobalNode("homeEx", ['1',"email"]);
  var email = emailNode._value;
  var home = new ewd.mumps.GlobalNode('homeEx', [1]);
  home._forEach(function(subscript, subNode) {
// subscript = next subscript found under the patient GlobalNode
// subNode = GlobalNode object representing the sub-node with the returned subscript
  var value = 'intermediate node';
  if (subNode._hasValue) value = subNode._value;
  console.log(subscript + ': ' + value);
});
		  
ewd.sendWebSocketMsg({
type: 'dbResults',
email: email

});
//return {messageRetrieved: true};
},
testDB2: function(params, ewd) {
   var home = new ewd.mumps.GlobalNode('homeEx', ['1']);
   return home._getDocument();
},
testDB3: function(params, ewd) {
  var homeIndex = new ewd.mumps.GlobalNode('homeEx', ['1']);
  var results = [];
  var homeById = {};
  var max = 10;
  var i = 0;
  homeIndex._forEach( function(name, node) {
    node._forEach(function(id) {
      i++;
      if (i > max) return true;
      results.push({
        id: id, 
        text: name
      });
      namesById[id] = name;
    });
    if (i > max) return true;
  });
  return {
    results: results,
    namesById: namesById
  };
},
testDB5: function(params, ewd) {
var home = new ewd.mumps.GlobalNode('homeEx', []);
 var results = [];
  var homeById = {};
  var max = 10;
  var i = 0;
home._forEach(function(subscript, subNode) {
	 subNode._forEach(function(id) {
	  i++;
      if (i > max) return true;
      results.push({
        id: id, 
        text: subscript
      });
      homeById[id] = subscript;
		 
   });
    if (i > max) return true;
// subscript = next subscript found under the patient GlobalNode
// subNode = GlobalNode object representing the sub-node with the returned subscript
var value = 'intermediate node';
if (subNode._hasValue) value = subNode._value;
console.log(subscript + ': ' + value);
});
return {
    results: results,
    homeById: homeById
  };
},
testDB: function(params, ewd) {
var home = new ewd.mumps.GlobalNode('homeEx', []);
 var results = [];
 var email="";
 var houseId="";
 var headline="";
 var location="";
 var bodyDesc='';
 var image="";
  var homeById = {};
  var max = 10;
  var i = 0;
home._forEach(function(subscript, subNode) {
	  i++;
      if (subscript > 10) return true;
	  var value = 'intermediate node';
      if (subNode._hasValue) value = subNode._value;
      //console.log(subscript + ': ' + value);
	 subNode._forEach(function(id,subNode1) {
	 
	  var value = 'intermediate node';
      if (subNode1._hasValue) value = subNode1._value;
      //console.log(id + ': ' + value);
	   subNode1._forEach(function(id1,subNode2){
		    var value = 'intermediate node';
            if (id1._hasValue) value = id1._value;
           // console.log(id1 + ': ' + value);
			//
			email = subNode.email._value;
			houseId = id1;
			headline = subNode2.$('desc').$('headline')._value;
			bodyDesc = subNode2.$('desc').$('body')._value;
			location = subNode2.$('location').$('desc')._value;
			image = subNode2.$('pic').$('main')._value;
			console.log("email " + ': ' + email + " houseId :" + houseId + " headline : " + headline + " location " + location + " image " + image + "bodyDesc : " + bodyDesc);
			//
		  results.push({
           email: email, 
           houseId: houseId,
		   headline : headline,
		   location : location,
		   image : image,
		   bodyDesc : bodyDesc
	         });
      
      });
     // homeById[id] = subscript;
		 
   });
   //results.push({
    //    id: subNode._getDocument()
        
     // });
// subscript = next subscript found under the patient GlobalNode
// subNode = GlobalNode object representing the sub-node with the returned subscript
/*var value = 'intermediate node';
if (subNode._hasValue) value = subNode._value;
console.log(subscript + ': ' + value);*/
});
return {
    results: results,
   // homeById: homeById
  };
},
getSearchTest: function(params, ewd) {
  var savedMsg = new ewd.mumps.GlobalNode('AMessage', []);
  var patient= new ewd.mumps.GlobalNode("home", ['1']);
  var patientRec0 = patient._value;
  var patientObj = patientRec0.split('^');
  var message = [];
  for (i = 0; i < 1; i++) { 
  message.push({
		fName: patientObj[0],
		lName: patientObj[1],
		//age: patientObj[2],
		age: i,
		city: patientObj[3],
		street: patientObj[4],
		pic : ""
          });
  }
		  
ewd.sendWebSocketMsg({
type: 'searchResultsTest',
message: message

});
return {messageRetrieved: true};
}

} //end of onMessage

}; //end of module.exports
