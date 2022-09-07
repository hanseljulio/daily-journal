//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin:test123@cluster0.vdtyytn.mongodb.net/blogDB", { useNewUrlParser: true });

const aboutMe = "https:\/\/hanseljulio.github.io/about.html"
const homeStartingContent = "Welcome to my Daily Journal! This website was created using Node.js as its backend and uses MongoDB for its database. I created this website to learn how Node.js and MongoDB works, and I have to say I'm having a lot of fun! You can mess around by going to the \"Compose me\" page and write something.";
const aboutContent = "More about me here: ";
const contactContent = "Contact me through email (hanseljulio@yahoo.com) or through LinkedIn ";

// Post schema
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
// End of post schema

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
  });

});

app.get("/about", function(req, res) {
  res.render('about', {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render('contact', {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render('compose');
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {title: post.title, content: post.content});
  });
  
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  // posts.push(post);
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
  
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
