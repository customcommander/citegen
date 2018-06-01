/>>.*CITATIONS.*>>/ {
  print "And the following citations"
  print "  \"\"\""
  CITATIONS = 1
  next
}

/<<.*CITATIONS.*<</ {
  print "  \"\"\""
  CITATIONS = 0
}

CITATIONS {
  print "  " $0
}
