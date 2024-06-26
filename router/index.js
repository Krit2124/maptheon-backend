const Router = require('express').Router;
const {body} = require('express-validator');

const userController = require('../controllers/user-controller');
const mapController = require('../controllers/map-controller');
const tagController = require('../controllers/tag-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

// Взаимодействие с данными пользователей
router.post('/registration',
    body('email').isEmail().withMessage('Неверный формат email'),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/profileInfo/:id', authMiddleware, userController.getUserProfileInfo);

// Взаимодействие с данными карт
router.post('/allMaps', authMiddleware, mapController.getAllMaps);
router.post('/myMaps', authMiddleware, mapController.getMyMaps);
router.post('/userMaps', authMiddleware, mapController.getMapsFromUser);
router.get('/myMapSettings/:id', authMiddleware, mapController.getMapSettings);
router.post('/userMapInfo', authMiddleware, mapController.getUserMapInfo);
router.post('/updateMapName', authMiddleware, mapController.updateMapName);
router.post('/updateMapDescription', authMiddleware, mapController.updateMapDescription);
router.post('/updateMapPublicStatus', authMiddleware, mapController.updateMapPublicStatus);
router.get('/myMapData/:id', authMiddleware, mapController.getMapData);
router.post('/saveMapData', authMiddleware, mapController.saveMapData);
router.post('/deleteMap', authMiddleware, mapController.deleteMap);

// Взаимодействие с избранными картами
router.post('/allFavouriteMaps', authMiddleware, mapController.getAllFavouriteMaps);
router.post('/addMapToFavourite', authMiddleware, mapController.addMapToFavourite);
router.post('/deleteMapFromFavourite', authMiddleware, mapController.deleteMapFromFavourite);

// Взаимодействие с тегами
router.get('/tagsForMap/:id', authMiddleware, tagController.getTagsByMap);
router.post('/bindTagToMap', authMiddleware, tagController.bindTagToMap);
router.post('/deleteTag', authMiddleware, tagController.deleteBindTagToMap);

module.exports = router;