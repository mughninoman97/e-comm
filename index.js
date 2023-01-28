import mongoose from "mongoose";
import app from './app'


import config from './config/index'


// create a fn 
// run a fun

// (async () => {})()
(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log('db connected ');

        app.on('error', (err) =>{
            console.log('ERROR :', err);
            throw err;
        })
        const onListening =  () => {
            console.log(`listening on ${config.PORT}`);
        
        }

        app.listen(config.PORT, onListening)

    } catch (error) {
        console.log(error);
        throw error //kill the execution
    }
})()