BEGIN {
  print "// This file has been auto-generated"
  print "// Run `make index.js` to regenerate it"
  print "module.exports = {"
}

{
  key = $0
  sub(/locales-/, "", key)
  print "'" key "'" ": " "require('./lib/" $0 ".json'),"
}

END {
  print "};"
}