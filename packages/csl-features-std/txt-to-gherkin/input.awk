/>>.*INPUT.*>>/ {
  print "And the following data"
  print "  \"\"\""
  INPUT = 1
  next
}

/<<.*INPUT.*<</ {
  print "  \"\"\""
  INPUT = 0
}

INPUT {
  print "  " $0
}
