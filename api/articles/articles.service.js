const Article = require("./articles.schema");

class ArticleService {
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  getByUser(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticleService();
