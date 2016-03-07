
/*
  Class to handle individual images within the main home page
 */
Image = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    var userServicesData = Meteor.subscribe('userData');
    var servicesData = Meteor.subscribe('services');
    return {
      userServices: Meteor.users.find().fetch(),
      services: Services.find({state: true}).fetch()
    }
  },
  propTypes: {
    image: React.PropTypes.object.isRequired,
    currentServices: React.PropTypes.array.isRequired
  },
  getInitialState: function(){
    return {
      condition:false,
      selectedServices: {}
    }
  },
  handleServiceSelect(service, active){
    //var slot = this.state.selectedServices[service.name];
    //
    ////removing services we don't enable
    //if(slot){
    //  delete this.state.selectedServices[service.name];
    //}
    //else{
    //  this.state.selectedServices[service.name] = true;
    //}

    //passing which service is selected for which image to parent
    this.props.onChange(service.name, active);
    //this.props.onChange(this.state.selectedServices);
  },
  //rendering services that are available
  renderServices(){
    return this.props.currentServices.map((service) =>{
      return <ImageServices onClick={this.handleServiceSelect.bind(null, service)} key={service.name} serviceName={service.name}/>
    })
  },
  //rendering our actual image inside a card
  render(){
    return (

          //<input placeholder="Caption"  type="text"/>
      <div className="card image-container">
        <div className="fixed-action-btn click-to-toggle" style={{position: "absolute", display:"inline-block", right: '10px', top: '10px', paddingTop: '0px'}}>
          <a className="waves-effect waves-light modal-trigger btn-floating red" onClick={this.props.onFocus} >
            <i className="large mdi-content-remove"></i>
          </a>
        </div>
        <div className="card-image waves-effect waves-block waves-light">
          <img className="upload-image" src={this.props.image.imageurl}/>
        </div>

        <div className="card-action">
          {this.renderServices()}
        </div>
      </div>
    );
  }
});
          //<a style={{height:'37px', position: 'absolute', right:'10px', top:'10px'}} onClick={this.props.onFocus} className="btn-floating btn waves-effect waves-light red"><i className="mdi-content-remove"></i></a>


/*
  Class to handle individual services for each image
 */
ImageServices = React.createClass({
  propTypes: {
    serviceName: React.PropTypes.string.isRequired
  },
  getInitialState(){
    return {
      showActive: false
    }
  },
  render(){
    return (
      <div onClick={this.toggleSelect} className={this.state.showActive ? "service-icon " + this.props.serviceName : "service-icon inactive " + this.props.serviceName}></div>
    )
  },
  //toggles selection attribute on each image service
  toggleSelect(){
    this.setState({
      showActive: !this.state.showActive
    }, function(){
      this.props.onClick(this.state.showActive);
    });

  }

});