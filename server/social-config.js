ServiceConfiguration.configurations.remove({
  $or: [ {service: "facebook"}, {service: "twitter"}, {service: "google"} ]
});
 
ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: '1538811913098172',
  secret: '09440da7720f33c4d05bb58b8d67fd45'
});

ServiceConfiguration.configurations.insert({
  "service": "google",
  "clientId": "741984941520-9mn97jjvu3vsqbghjiruebeop96cqq15.apps.googleusercontent.com",
  "secret": "HvdOe3C8l248AzZg49thP062"
});


ServiceConfiguration.configurations.insert({
  service: 'twitter',
  consumerKey: 'hhsLUrt8nUrefjeDRuUTrwsQN',
  secret: '70F1khPQUT0FO2VnF1Q0YxiMnswjhRqD3lVGN0eMLM0KncOVaV'
});

//ServiceConfiguration.configurations.insert({
//    "service": "imgur",
//    "clientId": "e808bd261a2d336",
//    "secret": "29d12ca3d2c67f7fcc46428375ff255d9b7c3e01"
//});


//ServiceConfiguration.configurations.insert({
//    "service": "google",
//    "clientId": "89929469817-2ndstqi3uvf7b95eru0js148ntliq28k.apps.googleusercontent.com",
//    "secret": "KxM_Pk086CxAjt6ZWnCJscJn"
//});