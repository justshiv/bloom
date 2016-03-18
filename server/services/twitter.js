// Accounts.oauth.registerService('twitter');

// Meteor.methods({
//   myLoginWithTwitter: function(options, callback) {
//     // support a callback without options
//     if (! callback && typeof options === "function") {
//       callback = options;
//       options = null;
//     }

//     var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
//     Twitter.requestCredential(options, credentialRequestCompleteCallback);
//   }
// });

var urls = {
  requestToken: "https://api.twitter.com/oauth/request_token",
  authorize: "https://api.twitter.com/oauth/authorize",
  accessToken: "https://api.twitter.com/oauth/access_token",
  authenticate: "https://api.twitter.com/oauth/authenticate?oauth_token="
};

var config = {
  service: 'twitter',
  consumerKey: Meteor.settings.TwitterClientKey,
  secret: Meteor.settings.TwitterSecret
};

var Twitter = new OAuth_SS(1, urls, config);

Meteor.methods({
  twitterGetToken: function() {
    return Twitter.generateRequestToken();
  },
  twitterAuthToken: function(params) {
    Twitter.generateAccessToken(params);
  },//,
  // verifyAuth: function() {
  //   return twitter.verifyService();
  // }
  post_twitter: function(image, tweet) {
    //console.log("gets here");
    Twitter.uploadImage(image, tweet, function(err, resp){
      if(err){
        console.log(err);
      }
      else {
        console.log('inside twitter: ' + resp);
        //console.log(resp.data.id);
        Images.insert({
          url: image,
          imageId: resp.data.id,
          link: resp.data.text
        })
      }
    });
  },
  delete_twitter: function(image){
    var imageId = Images.findOne({ url: image }).imageId;
    console.log(imageId);
    Twitter.deleteImage(imageId, function(err, resp){
      if(err){
        console.log(err);
      }
      else{
        console.log('successfully deleted Image');
      }
    })
  }
});