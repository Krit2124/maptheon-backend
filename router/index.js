const Router = require('express').Router;
const {body} = require('express-validator');

const userController = require('../controllers/user-controller');
const mapController = require('../controllers/map-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

// Взаимодействие с данными пользователей
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 63}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

// Взаимодействие с данными карт
router.post('/myMaps', authMiddleware, mapController.getMapsFromCurrentUser);
router.get('/myMapData/:id', authMiddleware, mapController.getMapData);
router.post('/saveMapData', authMiddleware, mapController.saveMapData);

module.exports = router