var LoginController = require('../controllers/login');

function setup(app) {
  var loginController = new LoginController(app);
  loginController.login('/login');
  loginController.logout('/logout');
  loginController.join('/join');
  loginController.password('/password');
  loginController.findPassword('/password/find');
  loginController.resetPassword('/password/reset/:code?');
}

module.exports = setup;