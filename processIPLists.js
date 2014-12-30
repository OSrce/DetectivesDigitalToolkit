

var fs = require('fs');

var path = require('path');  

var async = require('async');

var whois = require("node-whois");

var file = "DATA/ElapsuEl-ipaudit.txt";
var data = fs.readFileSync( path.resolve(__dirname, file), 'utf8');

//  ipObject :
// ipAddress, first use datestamp, last use datestamp, list of datestamps , number of uses.
// Carrier, Geolocation, retention info if known.
// 
// 
// 


//var ipPattern = new RegExp(/created_at: (\d\d\d\d-\d\d-\d\d \d\d\:\d\d\:\d\d +\d\d\d\d)\nlast_login_ip\: (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g );
var ipPattern = new RegExp(/last_login_ip\: (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g );
var ipList = [];
ipList = data.match( ipPattern );

var ipLookupObject;
var ipLookupObjectList = {};
var ipBlocks = {}; //To implement.


//function extractIPList(finishedExtract) {
function extractIPList() {
console.log("IP List:\n");
//for( var i=0; i<ipList.length; i++) {      
async.eachSeries( ipList, function(ipObj, theCallback) {
//  var ip = ipList[i].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
  var ip = ipObj.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
//    console.log(  ip[0] );
    if( !ipLookupObjectList.hasOwnProperty(ip[0]) ) {
      var ipLookupObject = {};
      ipLookupObject.ip = ip[0];
      ipLookupObject.isp = 'Uknown';
       whois.lookup(ip[0], function(err,data) {
          if( data ) {
            var whoisISP = data.match(/OrgName\: \s*(.*)/);
            if (whoisISP && whoisISP[1] ) {
              ipLookupObject.isp = whoisISP[1]; 
            }
          }
          ipLookupObjectList[ip[0]] = ipLookupObject;
      //      console.log(ipLookupObject);
          console.log("IP:"+ip[0]);
          theCallback();
          return;
      }) 
   } else {
      theCallback();
      return;
  } 
  }, function(err) {
    console.log("test2");
    printIPInfo();

    //    finishedExtract(null, 1);
    return;
  }
  );
      //console.log(ipList);
}


//function printIPInfo(callback) {
function printIPInfo() {
var sortedIPs = Object.keys( ipLookupObjectList).sort();
console.log("test5");
for( var key in sortedIPs) {
  var ip = sortedIPs[key];
  console.log( "IP: "+ip + " \tISP: "+ipLookupObjectList[ip].isp);
}
  console.log("Done.\n");
//  callback(null, 2);
}

extractIPList();

//async.series( [ function(callback) { extractIPList(callback); }, function(callback) { printIPInfo(callback) } ] );

//async.series( [ function(cb) { extractIPList(); cb(null,1); }, function(cb) {printIPInfo(); cb(null,2);} ], function(err, results) { console.log("All done for real!");
//console.log(results);
//} );




