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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
