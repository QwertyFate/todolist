const express = require("express");
const bodyParser = require("body-parser");  
const app = express();
const mongoose = require("mongoose");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
var items = [];
var workitems = [];
let anylist = [];
let typeneed = "";
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-qwerty:qwerty12321@cluster0.dd2mtgv.mongodb.net/?retryWrites=true&w=majority")




const todoschema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    entry: String
});
const todonow = mongoose.model("todolist", todoschema);






app.get("/", async function(req,res){
    var today = new Date();
    var currentday = today.getDay();
    var dayset = "";
    var option = {
        weekday: "long",
        month: "long",
        day: "numeric"

    };
    await generalcall();
    dayset = today.toLocaleDateString("en-US", option);
    res.render("list", {kindtitle: dayset, newitemlist: items, location:"/"});
    
});

app.post("/delete" ,async function(req,res){
    const name = req.body.checkbox;
    await gettype(name);
    await deletelist(name);  
    if (typeneed === "general"){
        res.redirect("/")
    } else{
        res.redirect("/" + typeneed);
    }
    
});

app.post("/", function(req,res){
    let type = "general"
    let newitem = req.body.text;
    items.push(newitem);
    addinglist(type,newitem);
    res.redirect("/");
    
});

app.get("/:anydata", async function(req, res){
    const pather = req.params.anydata;
    anylist = [];
    let location = "/" + pather;
    await getlist(pather);
    res.render("list", {kindtitle: pather, newitemlist: anylist, location: location});
    
});


app.post("/:anydata", async function(req,res){
    let type = req.params.anydata;
    let newitem = req.body.text;
    anylist.push(newitem);
    await addinglist(type, newitem);
    res.redirect("/" + type);
   // res.render("list", {kindtitle: type, newitemlist: anylist, location: "/" + type});

});

app.listen(3000,function(){
    console.log("server up at 3000 port");
});

async function addinglist(newtype,newentry){
    const newtodo = new todonow ({
        type: newtype,
        entry: newentry
    });
    newtodo.save();
};

async function generalcall(){
    items = [];
    const entrylist = await todonow.find({type: "general"});
    entrylist.forEach(function(enter){
        items.push(enter.entry);
    });
};

generalcall();

async function deletelist(deleteID){
   await todonow.deleteOne({entry: deleteID});
   items = [];
   generalcall();
};


async function getlist(pathway){
    const entrylist = await todonow.find({type: pathway});
    entrylist.forEach(function(enter){
        anylist.push(enter.entry);
    });
};

async function gettype(thetype){
    const typeneeded = await todonow.find({entry: thetype});
    await typeneeded.forEach(function(enter){
         typeneed = enter.type; 
    });
};