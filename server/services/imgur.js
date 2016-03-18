Meteor.methods({
   imgurAuthToken: function(params){
     var code = params.code;

     HTTP.post("https://api.imgur.com/oauth2/token", {
       data: {
         client_id: Meteor.settings.ImgurClientId,
         client_secret: Meteor.settings.ImgurClientSecret,
         grant_type: "authorization_code",
         code: code
       }
     }, function (error, result) {
       if(error) {
         console.log(error);
       }
       else{
         console.log('result: ', result.data);
         query = {};
         query['services.imgur.accessToken'] = result.data.access_token;
         Meteor.users.update(Meteor.userId(), {$set: query});
       }
     });
   },
   imgurAuthLink: function() {
     return "https://api.imgur.com/oauth2/authorize?client_id="+Meteor.settings.ImgurClientId+"&response_type=code";
   },
   create_imgur: function(albumTitle){
     //console.log(albumTitle);
     var access_token = Meteor.user().services.imgur.accessToken;
     HTTP.post("https://api.imgur.com/3/album",{
       headers: {
         Authorization: "Bearer " + access_token
       },
       params: {title: albumTitle}
     }, function(error, result){
       if(error){
         console.log(error);
       }
       else{
         //console.log(result.data.data.id);
         Services.update(
           {name: 'imgur'},
           {$push: {album: {albumId: result.data.data.id, albumTitle: albumTitle }}}
         );
           //service.album[service.album.length - 1].albumId = result.data.data.id;
           //service.album[service.album.length - 1].albumTitle = albumTitle;
         return result.content;

       }
     })
   },
   post_imgur: function(url) {
     console.log("posting to imgur");
     var imageId, link;
     var access_token = Meteor.user().services.imgur.accessToken;
     HTTP.post("https://api.imgur.com/3/image", {
       data: {image: url},
       headers: {
         Authorization: "Bearer " + access_token
       }
     }, function (error, result) {
       if(error) {
         console.log(error);
       }
       else{
         console.log('result: ', result);
         imageId = result.data.data.id;
         link = result.data.data.link;
         //console.log(imageId);
         Images.insert({
           url: url,
           imageId: imageId,
           link: link
         })
       }
     })
   },

  //PlayersList.find({ name: "David" }).fetch();
    delete_imgur: function(url){
      var access_token = Meteor.user().services.imgur.accessToken;
      //console.log(url);
      var imageId = Images.findOne({ url: url }).imageId;
      //console.log(imageId);
      HTTP.del("https://api.imgur.com/3/image/"+imageId,{
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else {
          //console.log(result);
          Images.remove({imageId: imageId});
        }
      })
    }
});

