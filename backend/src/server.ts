import { avaliationRouter } from './routes/avaliation.routes';
import { commentRouter } from './routes/comment.routes';

import { dissayRouter } from './routes/dissay.routes';
import { getAcessToken } from './config/spotifyConfig';
import { userRouter } from './routes/user.routes';
import * as dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'
import { connectToDatabase } from './config/db';
import musicRoutes from '../src/routes/music.routes'
import artistRoutes from '../src/routes/artist.routes'
import albumRoutes from '../src/routes/album.routes'
import searchRoutes from '../src/routes/searchGeneral.routes'
import playlistRoutes from '../src/routes/playlist.routes'

dotenv.config({path: './src/.env'})

const { MONGODB_URI } = process.env;

if( !MONGODB_URI ) {
    console.error("Nã foi definido nenhuma variável no config.env");
    process.exit(1)
}

const app = express();
app.use(express.json())
app.use(cors())

//Inicializa o token
const initializeToken = async () => {
    try {
        await getAcessToken()
        console.log("Token inicializado")
    }catch(E){
        console.error("Houve um erro: ", E)
    }
}
//Conecta ao banco de dados
connectToDatabase(MONGODB_URI)
    .then(()=> {
        //Usa a rota de users
       app.use('/users', userRouter)
       app.use('/dissays', dissayRouter)
       app.use('/avaliations', avaliationRouter)
       app.use("/comments", commentRouter)
       console.log("Conectado")
        
    })
    .catch((error)=> console.error("Ocorreu um erro ao se conectar com o banco: ", error))



initializeToken().then(() => {
    
   app.use('/music', musicRoutes)
   app.use('/artists', artistRoutes)
   app.use('/playlist', playlistRoutes)
   app.use('/album', albumRoutes)
   app.use('/allSearch', searchRoutes)
   
   app.listen(3000, ()=> {
    console.log(`Server funcionando na porta 3000...`)
    });
})

