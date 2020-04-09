const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const infoRoutes  = require("./routes/info")

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/", function(req,res){
    res.render("landing");
});

app.use(infoRoutes);

app.listen(3000, function(){
    console.log("Server has started on port 3000!");
});
