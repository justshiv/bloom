/**
 * Created by siobhan on 2016/01/25.
 */
var smtp = {
  username: 'postmaster@sandboxb54ee96179c948f2a4651270a9bc22ad.mailgun.org',   // eg: server@gentlenode.com
  password: 'f43b4c08745dd9e90782cab83738a8f6',   // eg: 3eeP1gtizk5eziohfervU
  server:   'smtp.mailgun.org',  // eg: mail.gandi.net
  port: 465
};

//email
process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
