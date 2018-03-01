BEGIN {
  print "// This file has been auto-generated"
  print "// Run `make index.js` to regenerate it"
  print "module.exports = {"
}

{
  key = $0
  sub(/.\/lib\/locales-/, "", key)
  sub(/.json/, "", key)
  print "  '" key "'" ": " "require('" $0 "'),"
}

END {
  print "};"
}