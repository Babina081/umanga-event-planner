module.exports = (theFunc) => (req, res, next) => {
  //Promise is the pre-built class of javascript
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
