import express  from 'express';
import multer   from 'multer';
import path     from 'path';
import User     from '../models/User.js';
import { authRequired } from './_auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req,_f,cb)=> cb(null, 'public/avatars'),
  filename   : (req,file,cb)=> {
    const ext = path.extname(file.originalname);
    cb(null, req.userId + ext);           
  }
});
const upload = multer({ storage });

router.get('/', authRequired, async (req,res)=>{
  const user = await User.findById(req.userId, 'name avatar theme email');
  res.json(user);
});

router.put('/', authRequired, upload.single('avatar'), async (req,res) =>{
  const update = { theme:req.body.theme };
  if (req.file) update.avatar = '/avatars/' + req.file.filename;

  const user = await User.findByIdAndUpdate(req.userId, update, { new:true });
  res.json(user);
});

export default router;
