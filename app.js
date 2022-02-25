const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

// Articles
app.get("/articles", (req, res) => {

  getArticles().catch(err => console.log(err));

  async function getArticles() {
    await mongodDbConnect();
    let articles = await Article.find({});
    mongoose.disconnect();

    res.send(articles);
  };

});

app.post("/articles", (req, res) => {

  createArticles().catch(err => console.log(err));

  async function createArticles() {
    let article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    await mongodDbConnect();
    article.save((err, articleDoc) => {

      mongoose.disconnect();

      res.send({
        error: err,
        result: articleDoc
      });

    });

  };

});

const port = 3000;
app.listen(port, console.log(`Server is now listening to Port ${port}.`));

async function mongodDbConnect() {
  await mongoose.connect("mongodb://localhost:27017/wikiDB");
}
