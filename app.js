//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();
let day = date.getDate();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://amansingh057:aman057@cluster0.83tb26w.mongodb.net/?retryWrites=true&w=majority/todoListDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist",
});
const item2 = new Item({
  name: "Hit + to add item",
});
const item3 = new Item({
  name: "Hit it delete item",
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, result) {
    if (result.length == 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }
        res.redirect("/");
      });
    } else {
      //   console.log(result);

      res.render("list", { ListTitle: day, newListItem: result });
    }
  });
});

// app.get("/work", function (req, res) {
//   res.render("list", { ListTitle: "Work List", newListItem: WorkItems });
// });
app.get("/:customListname", function (req, res) {
  const customListname = _.capitalize(req.params.customListname);

  List.findOne({ name: customListname }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new List
        console.log("Not exist");
        const list = new List({
          name: customListname,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListname);
      } else {
        //Show an existing list
        res.render("list", {
          ListTitle: foundList.name,
          newListItem: foundList.items,
        });
        console.log("Exist");
      }
    }
  });
});

app.post("/", function (req, res) {
  var item = req.body.newItem;
  const listName = req.body.list;
  const itemName = new Item({
    name: item,
  });
  if (listName === day) {
    itemName.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(itemName);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Succesfully Deleted !");
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
        if(!err){
            res.redirect('/'+listName)
        }
    })
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Running at port 3000");
});
