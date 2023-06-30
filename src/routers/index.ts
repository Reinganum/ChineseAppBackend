import express from 'express';
import authentication from './authRouter';
import list from './listRouter'
import study from './studyRouter'

const router = express.Router();

export const authRouter=(): express.Router=>{
    authentication(router)
    return router
}

export const listRouter=(): express.Router=>{
    list(router)
    return router
}

export const studyRouter=():express.Router=>{
    study(router)
    return router
}

