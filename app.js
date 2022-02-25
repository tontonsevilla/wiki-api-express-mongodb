const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

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
app.route("/articles")
  .get((req, res) => {

    getArticles().catch(err => console.log(err));

    async function getArticles() {
      await mongodDbConnect();
      Article.find({}, (err, results) => {

        mongoose.disconnect();

        res.send({
          error: err,
          result: results
        });

      });

    };

  })
  .post((req, res) => {

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

  })
  .delete((req, res) => {

    deleteArticles().catch(err => console.log(err));

    async function deleteArticles() {
      await mongodDbConnect();
      let articles = await Article.deleteMany({}, (err) => {
        if (err) {
          res.send({
            error: err,
            result: "Deletion of all articles not successful."
          });
        } else {
          res.send({
            error: err,
            result: "Successfully deleted all articles."
          });
        }
      });
      mongoose.disconnect();
    };

  });

// Article by Title
app.route("/articles/:title")
  .get((req, res) => {
    getArticleByTitle().catch(err => console.log(err));

    async function getArticleByTitle() {

      await mongodDbConnect();

      Article.findOne({title: {$regex: _.lowerCase(req.params.title), $options: "i"}}, (err, results) => {

        mongoose.disconnect();

        res.send({
          error: err,
          result: results
        });

      });

    };

  });

const port = 3000;
app.listen(port, console.log(`Server is now listening to Port ${port}.`));

async function mongodDbConnect() {
  await mongoose.connect("mongodb://localhost:27017/wikiDB");
}
