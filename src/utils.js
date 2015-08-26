module.exports.signatureToName = function signatureToName(signature) {
  var name = signature.split(/ |\(/)[0];
  return name;
};
