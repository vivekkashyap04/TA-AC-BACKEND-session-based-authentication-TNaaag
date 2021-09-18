var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Article = require('../models/user');
const Comment = require('../models/comment');

router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    res.render('articleList', { articles: articles });
  });
});

router.get('/new', (req, res) => {
  if (req.session.userId) {
    res.render('addArticle');
  } else {
    req.flash('error', 'You must login to create new article');
    res.redirect('/users/login');
  }
});

router.post('/', (req, res, next) => {
  req.body.author = req.session.userId;
  Article.create(req.body, (err, createdArticle) => {
    console.log(createdArticle);
    if (err) return next(err);
    res.redirect('/articles');
  });
});

router.get('/:slug', (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'You must login to see blog details');
    return res.redirect('/users/login');
  }
  let givenSlug = req.params.slug;
  Article.findOne({ slug: givenSlug })
    .populate('comments')
    .populate('author')
    .exec((err, article) => {
      if (err) return next(err);
      res.render('articleDetails', { article: article });
    });
});
router.get('/:slug/edit', (req, res, next) => {
  let givenSlug = req.params.slug;
  Article.findOne({ slug: givenSlug }, (err, article) => {
    if (err) return next(err);
    res.render('editArticle', { article });
  });
});
// Increment Likes
router.get('/:slug/likes', (req, res, next) => {
  let givenSlug = req.params.slug;

  Article.findOneAndUpdate(
    { slug: givenSlug },
    { $inc: { likes: 1 } },
    (err, article) => {
      if (err) return next(err);
      res.redirect('/articles/' + givenSlug);
    }
  );
});
// Update Article
router.post('/:slug', (req, res, next) => {
  let givenSlug = req.params.slug;
  req.body.tags = req.body.tags.trim().split(' ');
  Article.findOneAndUpdate(
    { slug: givenSlug },
    req.body,
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect('/articles');
    }
  );
});
// Delete Article
router.get('/:slug/delete', (req, res, next) => {
  let givenSlug = req.params.slug;
  Article.findByIdAndDelete({ slug: givenSlug }, (err, deletedArticle) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: deletedArticle._id }, (err, info) => {
      if (err) return next(err);
      res.redirect('/articles');
    });
  });
});
// Add comment
router.post('/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  req.body.author = req.session.userId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        let givenSlug = updatedArticle.slug;
        res.redirect('/articles/' + givenSlug);
      }
    );
  });
});

module.exports = router;
