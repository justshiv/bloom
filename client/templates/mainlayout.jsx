//Our main template inside of which we display all other templates
Meteor.startup(function(){
  $.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.10.3/js/bootstrap-tour-standalone.js")
});

MainLayout = React.createClass({

  //Required to import react data
  mixins: [ReactMeteorData],

  //Retrieving reactive data
  getMeteorData(){
    return {
      currentUser: Meteor.user()
    };
  },

  //Adding elements to template on page load. Here we add the `collapseOnClick`
  //attribute of the [Materialize](http://materializecss.com/) `sideNav` element
  //and append to the generated header
  componentDidMount() {
    //$('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.10.3/css/bootstrap-tour-standalone.css">');
    $(".button-collapse").sideNav({
      closeOnClick: true //closes when we click things
    });

    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
    $('head').append('<link rel="shortcut icon" type="image/png" href="favicon.png">');
  },



  //render method to create whole page
  //note the reactive logic to determine whether to show the "Sign In" or "Sign Out"
  //buttons
  render() {
    return (
      <div className="page-content">
        <title>SNAPSHARE</title>
        <header>
          <nav className="cyan darken-3">
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo">
              <i className="mdi-image-camera left"></i>SNAPSHARE
            </a>
            <a href="" data-activates="mobile-demo" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
            <ul className="right hide-on-med-and-down">
              {this.data.currentUser ? <li><a href="/services">Services</a></li>: ""}
              <li><a href={this.data.currentUser ? "" : "/signin"} onClick={this.data.currentUser ? this.signOut : ""}>{this.data.currentUser ? "Sign Out" : "Sign In" }</a></li>
            </ul>
            <ul className="side-nav" id="mobile-demo">
              {this.data.currentUser ? <li><a href="/services">Services</a></li>: ""}
              <li><a href={this.data.currentUser ? "" : "/signin"} onClick={this.data.currentUser ? this.signOut : ""}>{this.data.currentUser ? "Sign Out" : "Sign In" }</a></li>
            </ul>
          </div>
        </nav>
        </header>
        <main>
          <div className="container">
            <div className="row">
              <div className="col s12 m12 l12">
                <div className="section">
                  {this.props.content}
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="page-footer cyan darken-3">
          <div className="footer-copyright">
            <div className="container">
            © 2016 SNAPSHARE
              <a id="demo" className="grey-text text-lighten-4 right" href="">Support</a>
            </div>
          </div>
        </footer>
      </div>
    )
  },

  //method to sign out users and redirect them to sign in page with nice popup
  signOut(event){
    event.preventDefault();
    Meteor.logout();
    Materialize.toast('You have been signed out!', 4000);
    FlowRouter.go('/signin');
  }
});


