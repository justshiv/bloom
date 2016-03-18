//On startup of server remove all services
//and insert new ones
Meteor.startup(function(){
	Services.remove({});

  var supportedServices = [
    {name: 'facebook', state: true, album: []},
    {name: 'google', state: false, album: []},
    {name: 'imgur', state: true, album: []},
    {name: 'twitter', state: false, album: []},
    {name: 'pinterest', state: false, album: []},
    {name: 'tumblr', state: false, album: []}
  ];

  for(key in supportedServices){
    Services.insert(supportedServices[key])
  }
});

//configuring service configurations for twitter
ServiceConfiguration.configurations.remove({
  service: "twitter"
});

ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: Meteor.settings.consumerKey,
  loginStyle: "popup",
  consumerSecret: Meteor.settings.consumerSecret
});

//meteor methods required for services
Meteor.methods({
  toggleServiceCommon(service, opt) {
    // console.log('service: ', service);
    var user = Meteor.users.findOne({_id: this.userId});

    var query = {};
    query['services.'+ service + '.state'] = opt;
    Meteor.users.update(Meteor.userId(), {$set: query});
    return 'set ' + service + ' ' + opt;
  },
  initializeService: function(userId) {
    var query = {};
    query.userId = userId;
    query.services = {};
    UserServices.upsert({
      userId: userId
    }, {
      $setOnInsert: query
    });
  },
  addCommonService: function(service, params) {
    var userId = Meteor.userId();
    
    var userServ = UserServices.findOne({'userId': userId});
    var serviceObj = userServ.services;

    serviceObj[service] = params;
    serviceObj[service].state = true;
    
    UserServices.update(
      {'userId': userId}, 
      {
        $set: {'services': serviceObj}
      },
      {
        upsert: true
      }
    );
    return serviceObj;
  },
  removeMergedCollection: function (mergedUserId) {
    console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());
    Meteor.users.remove(mergedUserId);
  },
  removeService: function (userId, service) {
    query = {};
    query['services.' + service] = {};
    Meteor.users.update(Meteor.userId(), {$set: query}, function(err, result) {
      return result;
    });
  }
});