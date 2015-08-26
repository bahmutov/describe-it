function isVariable(signature) {
  return /^var /.test(signature);
}

function signatureToName(signature) {
  if (isVariable(signature)) {
    return signature.substr(4);
  }

  var name = signature.split(/ |\(/)[0];
  return name;
}

module.exports = {
  signatureToName: signatureToName,
  isVariable: isVariable
};
