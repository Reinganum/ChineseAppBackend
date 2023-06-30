import express from 'express';
import { register , login, handleRefreshToken} from '../controllers/authController';
import { auth } from '../middlewares/auth';
import { upload } from '../libs/multer';
import { updateAvatar } from '../controllers/avatarController';

export default (router:express.Router)=>{
    router.post('/register', register);
    router.post('/login', login);
    router.get('/refresh', handleRefreshToken);
    router.post('/uploadFile',auth,upload,updateAvatar)
}