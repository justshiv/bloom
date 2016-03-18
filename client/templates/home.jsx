// Seed or update userservices collection
Meteor.startup(function () {
  var userId = Meteor.userId();
  Meteor.call('initializeService', userId);
});

imageDetails = new Mongo.Collection('imageDetails');

//For camera
const takePhoto = BlazeToReact('takePhoto');

Home = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    //console.log(servicesData);
    return {
      userLoading: !userServicesData.ready(),
      servicesLoading: !servicesData.ready(),
      userServices: Meteor.users.find().fetch(),
      services: Services.find().fetch(),
      images: imageDetails.find({}, {
        sort: {
          createdAt: -1
        }
      }).fetch()
    }
  },

  activeAppList() {
    var services = this.data.services;
    var userServices = this.data.userServices[0].services;
    var list = [];

    for(service in userServices){
      if(userServices[service].state === true){
        var newServ = {
          'name': service,
          'state': true
        };
        list.push(newServ);
      }
    }

    return list;
  },
  getInitialState: function() {
    return {
      selectedImages: {},
      selectedServices: {},
      imagesPerService: {
        //'tumblr': {},
        //'facebook': {},
        //'pinterest': {},
        //'twitter': {},
        //'imgur': {}
      },
      cameraImages: {}
    }
  },
  renderImages(){
    var currentServices = this.activeAppList();
    return this.data.images.map((image) => {
      return <Image onFocus={this.deleteImage.bind(null, image)} onChange={this.addImageToService.bind(null, image)} key={image._id} currentServices={currentServices} image={image} selectedImages={this.state.selectedImages} />
    });
  },
  addImageToService(image, service, active){
    //console.log(service, active);
    var store = this.state.imagesPerService;
    store[service] = store[service] || {};
    if(active){
      store[service][image._id] = image;
    }
    else{
      delete store[service][image._id];
    }
    this.setState({
      imagesPerService : store
    }, function(){
      console.log(this.state.imagesPerService);
    });

    //for (key in services){
    //  var store = this.state.imagesPerService[key] || {};
    //  store[image._id] = image;
    //  this.state.imagesPerService[key] = store;
    //  console.log('Image added to ' + key);
    //}

  },
  uploadImagePerService(){
    for(service in this.state.imagesPerService){
      for(image in this.state.imagesPerService[service]){
        if(imageDetails.find(this.state.imagesPerService[service][image]._id).fetch().length !== 0) {
          postService = 'post_' + service;
          //console.log(this.state.imagesPerService[service][image].imageurl);
          if (service === 'twitter' || service === 'pinterest') {
            var tweet = 'Posting from SnapShare';
            console.log(this.state.imagesPerService[service][image].imageurl);
            Meteor.call(postService, this.state.imagesPerService[service][image].b64data, tweet, function (err, results) {
            });
          }
          else if (service === 'imgur') {
            console.log(this.state.imagesPerService[service][image].imageurl);
            Meteor.call(postService, this.state.imagesPerService[service][image].b64data, function (err, results) {
            });
          }
          else if (service === 'facebook') {
            console.log(this.state.imagesPerService[service][image].imageurl);
            Meteor.call(postService, this.state.imagesPerService[service][image].imageurl, function (err, results) {
            });
          }
          else {
            Meteor.call(postService, this.state.imagesPerService[service][image].imageurl, function (err, data) {
              console.log('Successful post to facebook');
              // console.log('Successful post to ' + service + ' : ' + data, err);
            });
          }
        }
      }
    }
//imageDetails.find().count()
    Materialize.toast('Successfully posted your images!', 4000);
  },

// Convert a data URI to blob
  dataURItoBlob(dataURI) {
      var byteString = atob(dataURI);
      //var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], {
          type: 'image/png'
      });
  },
  removePerService(images, services){
    for(service in this.state.imagesPerService){
      for(image in this.state.imagesPerService[service]){
        delService = 'delete_' + service;

        Meteor.call(delService, this.state.imagesPerService[service][image].imageurl, function(err, data) {
          console.log('Successful delete from ' + service + ' : ' + data, err);
        });
      }
    }
  },
  uploadImage(event) {
    event.preventDefault();
    var fileUpload = document.getElementById('input').files;

    function uploadForPreview(file){
      var reader = new FileReader();
      reader.addEventListener('load', function(){
        //var b64data = this.result.slice(23);
        var b64data = this.result.split(',')[1];

        var uploader = new Slingshot.Upload("myFileUploads");
        uploader.send(file, function (error, downloadUrl) {
          if (error) {
            console.error('Error uploading', error, uploader.xhr.response);
          }
          else {
            imageDetails._collection.insert({
              imageurl: downloadUrl,
              b64data: b64data,
              time: new Date()
            });
          }
        });
        //console.log(file);
        //console.log(b64data);
      }, false);

      reader.readAsDataURL(file);
    }

    if(fileUpload){
      [].forEach.call(fileUpload, uploadForPreview);
    }

  },
  //postImage(images, services) {
  //  // console.log('images: ', images);
  //  // console.log('services: ', services);
  //  var state = this.state.services;
  //  var postService;
  //  //console.log(state);
  //  _.each(services, function(key1, service) {
  //    _.each(images, function(key2, image) {
  //      console.log(service, image);
  //      if(key1 === true && key2 === true){
  //        postService = 'post_' + service;
  //        // console.log('postService: ', postService, image);
  //        Meteor.call(postService, image, function(err, data) {
  //          console.log('Successful post to ' + service + ' : ' + data);
  //        });
  //      }
  //    })
  //  })
  //},
  //deleteImage(images, services){
  //  // console.log('images: ', images);
  //  // console.log('services: ', services);
  //  var state = this.state.services;
  //  var delService;
  //  //console.log(state);
  //  _.each(services, function(key1, service){
  //    _.each(images, function(key2, image){
  //      // console.log(service, image);
  //      if(key1 === true && key2 === true){
  //        delService = 'delete_' + service;
  //        // state[service].delete(image);
  //        //console.log('deleteService: ', delService, image);
  //        Meteor.call(delService, image, function(err, data) {
  //        });
  //      }
  //    })
  //  })
  //
  //},
  //There is a limit to the number of albums that can be created in 24 hours
  //Add alert if the album limit exeeds
  createAlbum(services){
    var album = document.getElementById('album').value;
    document.getElementById('album').value = '';
    //console.log(album, services);
    var state = this.state.services;
    var albumService;
    _.each(services, function(key1, service){
      if(key1 === true){
        albumService = 'create_'+ service;
        Meteor.call(albumService, album, function(err, data){})
      }

    });
  },
  albumsList(){
    var newServices = this.data.services;
    //console.log(newServices);
    _.each(newServices, function(key1,service) {
      //console.log(key1.album);
      return key1.album.map((album) => {
        return <AlbumsAvailable key={album._id} album={album}/>
      });
    })

  },
  takePhoto(){
    console.log('Starting camera service');
    //console.log(this.state.cameraImages);
    //console.log(this.state);
    MeteorCamera.getPicture({
      width: 350,
      height: 350,
      quality: 75 }, function(err, data){
      if(err){
        console.log('Error taking images', err);
      }
      //console.log(data);
      Session.set('photo', data);
      //var image = document.getElementById ('picture');
      //image.src = data;
      var contentType = 'image/png';
      var b64Data = data.slice(23);
      var blob = b64toBlob(b64Data, contentType);
      function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

      var uploader = new Slingshot.Upload("myFileUploads");
      uploader.send(blob, function (error, downloadUrl) {
        //console.log(b64Data);
        if (error)
        {
          console.error('Error uploading', uploader.xhr.response);
        }
        else
        {
          console.log(downloadUrl);
          imageDetails._collection.insert({
            imageurl: downloadUrl,
            b64data: b64Data,
            time: new Date()
          });
        }
      });
    });
  },
  libraryEvent(){
    //console.log('phoneLibrary');
    if (Meteor.isCordova) {
      MeteorCamera.getPicture({
        width: 350,
        height: 350,
        quality: 75,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI
      }, function (err, data) {
        if (err) {
          console.log('Error taking images', error);
        }
        //console.log(data);
        Session.set('photo', data);
        Meteor.call('cameraPhonePhoto', data, function(err, result){});
      });
    }
    else{
      alert('Cordova only feature');
    }
  },
  renderServices(){
    return this.activeAppList().map((service) =>{
      return <div key={service.name} className={'service-icon ' + service.name}></div>
            //<div onClick={this.toggleSelect} className={this.state.showActive ? "service-icon " + this.props.serviceName : "service-icon inactive " + this.props.serviceName}></div>

    })
  },
  deleteImage(id){
    console.log(id);
    Materialize.toast('Successfully removed your image!', 4000);
    imageDetails._collection.remove(id);
  },
  drawModal(){
    $('#modal1').openModal();
    //return (
    //
    //);

  },

  render(){
    if (this.data.userLoading && this.data.servicesLoading) {
      return (
        <div style={{textAlign: 'center'}}>
          <p>Loading...</p>
            <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-orange-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
        </div>
      )
    }
    return (
      <div className="">
        <div className="row">
          <div className="card">
            <div className="card-content row">
              <div className="col s6">
                <h5>Active services</h5>
                {this.renderServices()}
              </div>
              <div className="col s6">
                <a style={{float:'right'}} className="btn orange" href='/services'>Manage Services</a>
              </div>
            </div>
          </div>
        </div>
        <div className="row thumbs">
            <div className="card image-container ">
              <div className="card-content" style={{paddingTop: '60px'}}>

                <div className="fixed-action-btn click-to-toggle" style={{position: "relative", display:"inline-block", right: '0', bottom: '0'}}>
                  <a className="waves-effect waves-light modal-trigger btn-floating btn-large orange" href="" onClick={this.drawModal}>
                    <i className="large mdi-content-add"></i>
                  </a>
                </div>
                <h5>Upload Images</h5>

                <div id="modal1" className="modal" style={{width: '60%'}}>
                  <div className="modal-content">
                    <h4>Upload Method</h4>
                    <div className="row" style={{marginTop: '20px'}}>
                      <div className="col s6">
                        <a href="#!" onClick={this.takePhoto} value="Camera" className="btn capture orange modal-action modal-close waves-effect waves-light">
                          <i className="material-icons left large mdi-image-camera-alt"></i>
                          Camera
                        </a>
                        < takePhoto />< libraryEvent />
                      </div>
                      <div className="file-field col s6">
                        <div className="btn orange  modal-action modal-close waves-effect waves-light">
                          <i className="material-icons left large mdi-device-devices"></i>
                          <span>Library</span>
                          <input id="input" type="file" multiple onChange={this.uploadImage}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {this.renderImages()}
        </div>
        <div className="row ">
          <div className="btn waves-effect waves-light orange" onClick={ this.uploadImagePerService}>
            UPLOAD TO SERVICES<i className="material-icons mdi-content-send right"></i>
          </div>
        </div>
      </div>
      //<button id="demo" className="btn" onClick={this.drawTour}>Start Demo</button>
    )
  }
});//<div className="btn waves-effect waves-light" onClick={ this.removePerService}>
        //  UNDO<i className="mdi-action-delete right"></i>
        //</div>
//ALBUM STUFF REMOVED FOR NOW
      //
      //  <div className ="row">
      //    <div className="col s12">
      //      {this.albumsList()}
      //    </div>
      //    <p className="flow-text">SELECT SERVICE YOU WANT TO ADD THE ALBUM TO AND CREATE NEW ALBUM</p>
      //    <input id="album" type="text" placeholder="Album Title" onSubmit={ this.createAlbum.bind(null, this.state.selectedServices) }/>
      //    <button className="btn waves-effect waves-light" onClick={ this.createAlbum.bind(null, this.state.selectedServices) }>Create New Album
      //      <i className="mdi-av-queue right"></i></button>
      //  </div>

/*Albums available for posting images*/
AlbumsAvailable = React.createClass({
  getInitialState: function(){
    return {
      condition:false
    }
  },
  render(){
    //console.log(this.props.album);
    return (
      <li className="tab col s3">{this.props.album.albumTitle}</li>
    )
  }
});