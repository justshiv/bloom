// var urls = {
//   requestToken: "https://api.tumblr.com/oauth/request_token",
//   authorize: "https://api.tumblr.com/oauth/authorize",
//   accessToken: "https://api.tumblr.com/oauth/access_token",
//   authenticate: "https://api.tumblr.com/oauth/authenticate?oauth_token="
// };
var urls = {
  requestToken: "https://www.tumblr.com/oauth/request_token",
  authorize: "https://api.tumblr.com/oauth/authorize",
  accessToken: "https://www.tumblr.com/oauth/access_token?",
  authenticate: "https://www.tumblr.com/oauth/authorize?oauth_token="
};

var config = {
  service: 'tumblr',
  consumerKey: Meteor.settings.TumblrClientKey,
  secret: Meteor.settings.TumblrSecret
}

var Tumblr = new OAuth_SS(1, urls, config);
// console.log('tumblr: ', tumblr);

Meteor.methods({
  tumblrGetToken: function() {
    return Tumblr.generateRequestToken();
  },
  tumblrAuthToken: function(params) {
    console.log(params);
    Tumblr.generateAccessToken(params);
  },//,
  // verifyAuth: function() {
  //   return tumblr.verifyService();
  // }
  tumblrPost: function(tweet){
    Tumblr.post(tweet);
  },
  tumblrUpload: function(image, tweet){
    console.log('image');
    Tumblr.uploadImage(image, tweet)
  }
});
// Meteor.methods({
//   LogToTumblr(){
//     console.log('Tumblr');
//     ////var test = "https://www.tumblr.com/oauth/authorize?oauth_token="+Meteor.settings.tumblrToken;
//     ////console.log('test server: ', test);
//     ////return test;
//     //HTTP.post("")
//   }
// });