import  express,{Express} from 'express';
import cors from 'cors'; // Cross-origin resource sharing library
import  morgan from 'morgan'; // library for loggin
import { queueMonitor } from '../queueMonitor/queueMonitor';
//config
require('dotenv').config(); // enable .env

export class Server{
    app: Express;
    port: string|number;

    constructor(){

        this.app = express();
        this.port  = process.env.PORT||3000; 
        
        this.runCors();
        this.middlewares();  
        this.routes();
        this.runMonitor();
    }
    runCors(){
        this.app.use(cors());
      }
    middlewares(){
        this.app.use(express.static('public'));
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }
    routes() {
        //this.app.get('/', (req, res) => { res.json({ message: 'ok' }) });

        //this.app.get('/example', require('../routes/example-routes'));
        //this.app.use(this.auth,require('../path'));
    }
    runMonitor(){
        
            try {
                queueMonitor()
            } catch (error) {
                console.log("ERROR: ",error);
                queueMonitor();
            }

                
        


        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log("server running at port",this.port);
        })
    }
}

