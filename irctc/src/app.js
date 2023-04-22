const express = require("express");
const path = require("path");
const app = express();
// const hbs = require("hbs")
const ejs = require("ejs")
require("./db/connect")
const userModel = require('./models/users')
const stationModel = require('./models/station')
const trnModel = require('./models/trains')
const priceModel = require('./models/price')
const bookModel = require('./models/book')
const searchModel = require('./models/search')
const confirmModel = require('./models/confirm')
const otpModel = require("./models/otp")
var jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')


const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const temp_path = path.join(__dirname, "../templates/views");
// const part_path = path.join(__dirname, "../templates/partials");
// const part_path = path.join(__dirname, "../templates/partial");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", temp_path)
// ejs.registerPartials(part_path);

// function checkLoginUser(req, res, next) {
//   var userToken = localStorage.getItem("userToken");
//   try {
//     var decoded = jwt.verify(userToken, "loginToken");
//   } catch (err) {
//     res.redirect("/");
//   }
//   next();
// }

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkexitemail = userModel.findOne({ email: email });
  checkexitemail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render('index');
   
    }
    next();
  });
}






app.get("/", (req, res) =>{
  var loginUser = localStorage.getItem("loginUser");
  if(loginUser){
    res.redirect('/home')
  }
  else {
    res.render("index",{msg:''})
  }
});



app.post('/mail', async (req,res)=> {
 
  const code = req.body.code;

  const checkUser = otpModel.findOne({ code:code });
  checkUser.exec((err, data) => {
   if(data) {
    const gmail= data.email;
    res.render('generate',{title:"Create New Password",msg:'',gmail:gmail,succ:''})
   }
   else {
    res.render('forget',{ title: 'IRCTC', msg: '',succ:'',gmail:'',errors:'OTP NOT MATCHED' })
   }
  })

})

app.get('/forget',  (req,res)=> {
  res.render('forget',{ title: 'IRCTC', msg: '',succ:'',email:'',errors:'' })
})
app.get('/generate',(req,res)=> {
  res.render("generate",{title:"Create New Password",msg:'',gmail:'',succ:''})
})
app.post('/generate',async (req,res)=> {
  const email = req.body.gmail;
  const password = req.body.password;
  const confpassword = req.body.confpassword;
  if(!password || !confpassword) {
    res.render("generate",{title:"Create New Password",msg:'Please fill all details',gmail:'',succ:''})
  }
  else {
    if(password == confpassword){
      
      const checkUser = userModel.findOne({ email:email });
      await checkUser.exec((err,data)=>{
        if(err) throw err
        const id = data._id;
        var passdelete = userModel.findByIdAndUpdate(id, { password:password,
 confirmpassword:confpassword });
        passdelete.exec(function (err) {
          if (err) throw err;
          res.render("generate",{title:"Create New Password",msg:'',gmail:'',succ:'Password Reset Successfully'});
        });
      })
  
 
    }
    else {
      res.render("generate",{title:"Create New Password",msg:'Password and confirm password not matched',gmail:''});
    }
  }
})

app.post('/forget', async (req,res)=> {
  var email = req.body.email;
  var minm = 100000;
  var maxm = 999999;
  var code = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  var expiryt = new Date().getTime() + 300*1000;
  const checkUser = userModel.findOne({ email:email });
  checkUser.exec((err, data) => {
   if(data){

    var userDetails = new otpModel({
    
      email:email,
      code:code,
      expiryt:expiryt
      
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render('forget',{title:"IRCTC", msg:"",succ:'OTP send in your mail',gmail:email,errors:''});
   
    });


    let transporter = nodemailer.createTransport({
    service:"gmail",
    auth : {
      user:"gayatripadhy339@gmail.com",
      pass:"nlsjfcoysdkgvtvm"
    },
    tls:{
      rejectUnauthorized:false
    }
  })
  
  let mailOptions = {
    from: "gayatripadhy339@gmail.com",
    to: email,
    subject:"OTP FOR IRCTC",
    text:`Your OTP For IRCTC ACCOUNT :  ${code}`
  }

  transporter.sendMail(mailOptions,(err,success)=>{
  if(err) {
    throw err;
  }
  else {
    console.log("successfully sent")
  }
  })
  }
  else {
    res.render("forget",{title:"college dunia", msg:"Email not exist",succ:'',errors:''})
  }
  })

})




app.get('/home', async (req,res)=> {
  var loginUser = localStorage.getItem("loginUser");
  if(loginUser){ 
  const stn = stationModel.find({})
  const trn = trnModel.find({})
  const srh = searchModel.find({})
  const conf = confirmModel.find({})
  try {
    let stns = await stn.exec()
    let trns = await trn.exec()
    let loc = await srh.exec()
    let confd = await conf.exec()
    res.render('home',{stns:stns,trns:trns,loc:loc,confd:confd})
  }
  catch(err){
    throw Error
  }
}
else {
  res.render('index')
}
})

app.post("/login",(req, res) => {

  var email = req.body.email;
  const password = req.body.password;
  const checkUser = userModel.findOne({ email: email });
  checkUser.exec((err, data) => {
    if (data == null) {
      res.render("index");
      console.log("plese insert right data");
    } else {
      if (err) throw err;
      var getUserID = data._id;
      var getPassword = data.password;
      console.log(getPassword);
      if (password === getPassword) {
        var token = jwt.sign({ userID: getUserID }, "loginToken");
        localStorage.setItem("userToken", token);
        localStorage.setItem("loginUser", email);
       if(email == "real@gmail.com" && password == "1234"){
        res.redirect('/admin')
       }else {
        res.redirect('/home')
       }
      
      } else {
        res.render('index');
        console.log("username or password not matched");
      }
    }
  });

});

app.get('/admin', async (req,res)=>{
  const user = userModel.find({})
  const train = trnModel.find({})
  const stn = stationModel.find({})
  const price = priceModel.find({})
  const conf = confirmModel.find({})
  try {
    let data = await user.exec()
    let trn = await train.exec()
    let stns = await stn.exec()
    let ps = await price.exec()
    let confd =await conf.exec()
    res.render('admin',{udata:data,tdata:trn,sdata:stns,pdata:ps,confd:confd})
  }
  catch(err){
    throw Error;
  }

})

app.get('/passcheck',(req,res)=>{
  res.render('passcheck')
})

app.get("/train/delete/:id",(req,res)=> {
  var passcat_id = req.params.id;
  var passdelete = trnModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/admin');
  });
})

app.get("/stn/delete/:id",(req,res)=> {
  var passcat_id = req.params.id;
  var passdelete = stationModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/admin');
  });
})

app.get("/user/delete/:id",(req,res)=> {
  var passcat_id = req.params.id;
  var passdelete = userModel.findByIdAndDelete(passcat_id);
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/admin');
  });
})



  app.post('/signup',checkEmail,function(req, res, next) {
          var fname=req.body.fname;
          var lname=req.body.lname;
          var email=req.body.email;
          var pnumber=req.body.pnumber;
          var password=req.body.password;
          var confpassword=req.body.confirmpassword;

         

    if(password !=confpassword){
      res.redirect('/passcheck');
    }else{
     
          var userDetails=new userModel({
            fname:fname,
            lnane:lname,
            pnumber:pnumber,
            email:email,
            password:password,
            confirmpassword:confpassword
          });
       userDetails.save((err,doc)=>{
          if(err) throw err;
          res.redirect('/usersuccess');
       });
      } 
    
  });

  app.get('/usersuccess',(req,res)=> {
    res.render('usersuccess')
  })
  app.post('/book', (req,res)=> {
    const tname = req.body.tname;
    const trnno = req.body.trnno;

    var trainDetails = new bookModel ({
      tname:tname,
      trnno:trnno
    });
    trainDetails.save((err,doc)=>{
      if(err) throw err;
      res.redirect('/ticket')
    });
  })

  app.post('/book-details', (req,res)=> {
    const ftrain = req.body.ftrain;
    const ttrain = req.body.ttrain;
    const date = req.body.date;
    var trainDetails = new searchModel ({
      ftrain:ftrain,
      ttrain:ttrain,
      date:date
    });
    trainDetails.save((err,doc)=>{
      if(err) throw err;
      res.redirect('/home')
      console.log("details Saved")
    });
  })

  app.post('/confirm-ticket',async (req,res)=> {

    // console.log(req.body)
    // res.redirect('/ticket')
    var loginUser = localStorage.getItem("loginUser");
    // res.redirect('payment')
    const bookdetail = bookModel.find({});
    const stndetail = searchModel.find({})
    try {
      let book =await bookdetail.exec()
      const stnd = await stndetail.exec()
      var len = book.length
      var lens = stnd.length
    
   
   const sfrom =stnd[lens-1].ftrain;
   const sto = stnd[lens-1].ttrain;
   const trainname = book[len-1].tname;
   const trainnumber = book[len-1].trnno;
   const dob = req.body.dob;
   const gender = req.body.gender;
   const fname = req.body.fname;
   const lname = req.body.lname;
   const email = loginUser;
   const phone = req.body.phone;
   const subject = req.body.subject;
   const age = req.body.age;
   const coach = req.body.coach;
   const passangers = req.body.passangers;
   const pass_age = req.body.pass_age;
   const pnr = Math.floor(Math.random() * 1000000000);
   const tid = 100;
   if(!sfrom || !sto || !trainname  || !trainnumber || !dob || !gender || !fname || !lname || !email || !phone || !age || !coach){
     res.redirect('/fillt')
   }
   else {

    var trainDetails = new confirmModel ({
      sfrom:sfrom,
      sto:sto,
      trainname:trainname,
      trainnumber:trainnumber,
      dob:dob,
      gender:gender,
      fname:fname,
      lname:lname,
      email:email,
      phone:phone,
      age:age,
      coach:coach,
      subject:subject,
      pnr:pnr,
      passangers:passangers,
      pass_age:pass_age,
      tid:tid
    });
    trainDetails.save((err,doc)=>{
      if(err) throw err;
      res.redirect('/payment')
      console.log("details Saved")
    });
  
  }
}
catch(err){
  throw Error
}

  })
  
  app.get('/fillt',(req,res)=> {
    res.render('fillt')
  })
  app.get('/payment', async (req,res)=> {
   const conf = confirmModel.find({})
   const ps = priceModel.find({})
   try {
    let price = await ps.exec()
    let confd =await conf.exec()
    res.render('payment',{confd:confd,price:price})
   }
   catch(err) {
    throw Error
   }
    
  })

  app.post('/add-new-train',function(req, res, next) {
   var name = req.body.name;
   var number = req.body.number;
   var atime = req.body.atime;
   var dtime = req.body.dtime;
    if(!name || !number ){
      res.redirect('/admin')
      console.log("please Fill all the details")
    }
    else {
      var userDetails=new trnModel({
       name:name,
       number:number,
       atime:atime,
       dtime:dtime
    });
    userDetails.save((err,doc)=>{
    if(err) throw err;
    res.redirect('/success');
 })  ;

}
});

app.get('/ticket',async (req,res)=> {
  const bookdetail = bookModel.find({});
  const stndetail = searchModel.find({})
  try {
    let bks = await bookdetail.exec()
    let station =await stndetail.exec()
    res.render('ticket',{bks:bks,station:station})
  }
  catch(err) {
    throw Error
  }
})


  app.post('/stations',function(req, res, next) {
    var stn=req.body.stn;

    if(!stn){
      res.redirect('/admin')
      console.log("Please Fill all the Details")
    }
    else {

    var userDetails=new stationModel({
     stn:stn
    });
 userDetails.save((err,doc)=>{
    if(err) throw err;
    res.redirect('/success');
    console.log("Station added")
 })  ;
}
});

app.get('/success',(req,res)=> {
  res.render('success')
})
app.post('/payments',(req,res)=> {
  res.redirect('/done')
})
app.post('/paymentp',(req,res)=> {
  res.redirect('/done')
})
  
app.post('/payment',(req,res)=> {
  res.redirect('/done')
})
app.get('/done',(req,res)=> {
  res.render('done')
})

app.get('/dashboard',async (req,res)=> {
  var loginUser = localStorage.getItem("loginUser");
  const conf = confirmModel.find({})
  const user = userModel.findOne({email:loginUser})
  try {
    let confd = await conf.exec()
    users =await user.exec()
    res.render('dashboard',{confd:confd,loginUser:loginUser,users:users})
  }
  catch(err) {
    throw Error
  }
  
})

app.post('/paymentu',(req,res)=> {
  res.redirect('/done')
})
  
app.get('/page',async (req,res)=> {
  const conf = confirmModel.find({})
   try {
    let confd =await conf.exec()
    res.render('page',{confd:confd})
   }
   catch(err) {
    throw Error
   }
  
})
app.get('/fill',(req,res)=> {
  res.render('fill')
})
app.get("/fills",(req,res)=> {
  res.render('fills')
})
app.post("/prices",async (req,res)=> {
  const lac = req.body.lac;
  const sac = req.body.sac;
  const ac  = req.body.ac;
  const sl = req.body.sl;
  const gn = req.body.gn;
  if(!ac || !sac || !lac || !sl || !gn){
    res.render('/fills')
  }
 

  // ONLY ONE TIME UNCOMMENT THIS PART
  else {
    var userDetails = new priceModel({
     ac:ac,
     lac:lac,
     sac:sac,
     sl:sl,
     gn:gn
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.redirect("/success")
      console.log("SuccessFully Store");
  });
 }
})


app.get('/ticket/edit/:id',(req,res)=>{
  var id = req.params.id;
  const tid = 101;
  var passdelete = confirmModel.findByIdAndUpdate(id, { tid:tid});
  passdelete.exec(function (err) {
    if (err) throw err;
    res.redirect('/refund');
  });
})

app.get('/refund',(req,res)=>{
  res.render('refund')
})

app.get('/logout', function (req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
});

