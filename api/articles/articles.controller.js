const ForbiddenError = require("../../errors/forbidden");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      // l'auteur est l'utilisateur connecté
      const article = await articlesService.create({ ...req.body, user: req.user._id });
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new ForbiddenError();
      }
      const article = await articlesService.update(req.params.id, req.body);
      req.io.emit("article:update", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new ForbiddenError();
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
