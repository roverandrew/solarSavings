const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const infoRoutes  = require("./controllers/form")

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", function(req,res){
    res.render("landingForm");
});

app.use(infoRoutes);

app.listen(3000, function(){
    console.log("Server has started on port 3000!");
});
