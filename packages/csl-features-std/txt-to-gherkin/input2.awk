/>>.*INPUT2.*>>/ {
  print "And the following additional data"
  print "  \"\"\""
  INPUT2 = 1
  next
}

/<<.*INPUT2.*<</ {
  print "  \"\"\""
  INPUT2 = 0
}

INPUT2 {
  print "  " $0
}
