BEGIN {
  print "// This file has been auto-generated"
  print "// Run `make index.js` to regenerate it"
  print "module.exports = {"
}

# Exclude test files
/test\.js/ {
  next
}

{
  key = $0
  sub("./lib/", "", key)
  sub(".js", "", key)
  print "  '" key "'" ": " "require('" $0 "'),"
}

END {
  print "};"
}