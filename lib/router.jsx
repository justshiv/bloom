
//explanation: https://github.com/kadirahq/meteor-react-layout
var insecure = FlowRouter.group({});

var authenticated = FlowRouter.group({
  triggersEnter: [function(){
    if(!Meteor.loggingIn() && !Meteor.userId()){
      Session.set('redirectAfterLogin', FlowRouter.current().path);
      FlowRouter.go('signin');
    }
  }]
});

insecure.route("/splash", {
  name: 'splash',
  subscriptions: function() {
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Splash />
    });
  }
});
insecure.route("/images", {
  name: 'images',
  subscriptions: function() {
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Images />
    });
  }
});


authenticated.route("/", {
  name: 'home',
  subscriptions: function() {
    this.register('images', Meteor.subscribe('images'));
    this.register('userData', Meteor.subscribe('userData'));
  },
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Home />
    });
  }
});

insecure.route("/signin", {
  name: 'signin',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Signin />
    });
  }
});

insecure.route("/signup", {
  name: 'signup',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Signup />
    });
  }
});

insecure.route("/recover-password", {
  name: 'recover-password',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <RecoverPassword />
    });
  }
});

insecure.route("/reset-password/:token", {
  name: 'reset-password',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <ResetPassword />
    });
  }
});

insecure.route("/verify-email/:token", {
  name: 'verify-email',
  subscriptions: function() {},
  action: function() {
    var token = FlowRouter.getParam("token");
    Accounts.verifyEmail(token, function (error) {
      if (error) {
        Materialize.toast('Something has gone wrong', 4000);
      }
      else{
        Materialize.toast('Thank you for verifying your account!', 4000);
        FlowRouter.go('/');
      }
    });
  }
});

insecure.route("/privacy", {
  name: 'privacy',
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <Privacy />
    });
  }
});

FlowRouter.route("/api", {
  subscriptions: function() {},
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <API />
    });
  }
});

authenticated.route("/services", {
  name: 'services',
  subscriptions: function() {
    //var selector = {category: {$ne: "private"}};
    this.register('services', Meteor.subscribe('services'));
    this.register('userData', Meteor.subscribe('userData'));
  },
  action: function(params, queryParams) {
    ReactLayout.render(MainLayout, {
      content: <ServicesList />
    });
  }
});

authenticated.route("/services/:service", {
  name: 'services',
  subscriptions: function() {
    this.register('services', Meteor.subscribe('services'));
    this.register('userData', Meteor.subscribe('userData'));
  },
  action: function(params, queryParams) {
    window.close();
    console.log('params: ', params);
    console.log('queryParams: ', queryParams);
    if(typeof params !== undefined) {
      Meteor.call(params.service + 'AuthToken', queryParams);
    }
  }
});

FlowRouter.notFound = {
  action: function() {
    ReactLayout.render(MainLayout, {
      content: <NotFound />
    });
  }
};