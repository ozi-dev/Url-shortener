import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import {nanoid} from "nanoid";
import urlExist from "url-exist";
import URL from "./models/urlModel.js";
import fetch from 'isomorphic-fetch';
import {stringify} from "querystring";
import users from "./models/users.js";
import userURL from "./models/userURL.js";
import alert from 'alert';
import bodyParser from "body-parser";
import session from "express-session";

//const kisisellestirme = document.getElementById("ozel");


const __dirname = path.resolve();


dotenv.config();

const app = express();
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(session({
    secret: 'Özel-Anahtar',
    resave: false,
    saveUninitialized: true
  }));
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect(process.env.MONGO_DB_URI, (err) => {
    if (err) {
        console.log("Database bağlantısı başarısız");
        throw err;
    }else{
        console.log("Database bağlantısı başarılı");
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});



app.get('/admin', async (req,res) => {
    
        res.sendFile("/public/kullanici-dash/index.html", {root: __dirname });

    
})


const validateURL = async (req, res, next) => {
    const {url} = req.body;
    const isExist = await urlExist(url);
    if (!isExist) {
        return res.json({message: "Geçersiz Bağlantı", type: "failure"});
    }
    next();
};


app.post('/ozi', async (req, res) => {
    while (!req.body.captcha)
        return res.json({success: false, msg: "Lütfen Captcha'yı seçiniz"});

    const secretKey = '6Led7kojAAAAACF0smbT5PfIKMR20OkgscUun';

    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    const token = req.get("User-Key");

    const body = await fetch(verifyURL).then(res => res.json());
    app.post("/link", validateURL, (req, res) => {
        const {url} = req.body;
        console.log(url);
        const {kisi} = req.body;
        console.log(kisi);
        console.log(req.body);

        let shortened_url;
        shortened_url = nanoid(10);
        console.log(shortened_url);
        if(kisi !== undefined ){ 
            console.log("girdi");
            shortened_url = kisi;
        };

        let newURL = new URL({
            url,
            user_id: req.session.user_id,
            shortened_url: (shortened_url),
            created_at: new Date(),
        });
    
        try {
            newURL.save((err, doc) => {
                const token = req.get("User-Key");
                console.log(token);

                let rel = new userURL(
                    {
                        user_id: req.session.user_id,
                        url_id: doc.url,
                    }
                )
    
                rel.save();

            });
        } catch (err) {
            res.send(" Kaydetme sırasında bir hata meydana geldi. Lütfen tekrar deneyin!");
        }
        res.json({message: `https://url41.herokuapp.com/${newURL.shortened_url}`, type: "success"});
    });
});



app.get("/links", async (req, res) => {
    const token = req.get("User-Key");
    const rel = await userURL.find({user_id: token});
    const urls = await URL.find({_id: rel.map((user) => user.url_id)});
    res.json(urls);
});

app.get("/:shortened_url", async (req, res) => {
    const token = req.get("user_id");
    const shortened_url = req.params.shortened_url;
    const originalLink = await URL.findOne({shortened_url});

    try {
        if (originalLink) {
            await URL.updateOne(
                {
                    shortened_url: req.params.shortened_url
                },
                {$inc: {clicks: 1}},
                {user_id: token}
            );
            return res.redirect(originalLink.url);
        } else return res.sendFile(__dirname + "/public/404.html");
    } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
    }

});

app.post("/register", async (req, res) => {
    let {name, surname, email, password, phone_number} = req.body

    users.find({email: email}, (err, data) => {
        if (data.length > 0) {
            res.json({message: "Bu email adresi kullanımda"});
        } else {
            let newUser = new users({
                name: name,
                surname: surname,
                email: email,
                password: password,
                phone_number: phone_number
            });
            try {

                newUser.save();
            } catch (err) {
                res.send("Kaydetme sırasında bir hata meydana geldi. Lütfen tekrar deneyin!");
            }
            alert("Kayıt Başarılı!");

            res.sendFile('public/giris.html', {root: __dirname });
         
           //res.send({message: "success", user_id: newUser._id});
        }
    });
});

app.post("/login", async (req, res) => {
    let {email, password} = req.body

    users.findOne({email: email},(err, data) => {
        if (data.length === 0) {
            res.send({message: "Bu email adresi kullanımda değil"});
        }

        password !== data.password ? 
            res.json({message: "Şifre yanlış"}) :
            //res.json({message: "success", user_id: data[0]._id});
            req.session.user_id=data._id;
            console.log("_id",req.session.user_id);
            res.sendFile('public/kullanici-homepage.html', {root: __dirname });
    });
});


app.delete("/del/:email", function(req,res){
    let delEmail=req.params.email;

    users.findOneAndDelete(({email:delEmail}),function(err,docs){
        if(err){
            res.send("error occured")
        }
        else{
            if(docs==null){
                res.send("Yanlış mail adresi girdiniz.")
            }
            else{
                res.send(docs);
            }
        }
    })

});

app.put("/update/:email", async(req,res)=>{
    let email=req.params.email;
    let updateName=req.body.name;
    let updateSurname=req.body.surname;
    let updatePassword=req.body.password;
    let updatePhone=req.body.phone_number;
   
    users.findOneAndUpdate({email:email},{$set:{name:updateName,surname:updateSurname,password:updatePassword,phone_number:updatePhone}},
        {new:true},(err,data)=>{
            if(err){
                res.send("error occured")
            }else{
                if(data==null){
                    res.send("bulunamadı");
                }
                else{
                    res.send(data)
                }
            }
          
        })

});

app.listen(process.env.PORT || 8000, () => {
    console.log("server 8000 numaralı portta çalışıyor");
});
