import express from 'express';
import { addCharacterToList, getMyLists, createList, removeList, selectList, getSelectedList, studyCounter} from '../controllers/listController';
import { auth } from '../middlewares/auth';

export default (router:express.Router)=>{
    router.get('/myLists',auth, getMyLists);
    router.post('/removeList', removeList);
    router.put('/newChar', auth, addCharacterToList);
    router.put('/studyCounter', auth, studyCounter);
    router.post('/createList',auth, createList);
    router.get('/getSelectedList', auth, getSelectedList);
    router.get('/myLists',auth, getMyLists);
    router.post('/selectList', auth, selectList);
    router.get('/:id',auth);
}