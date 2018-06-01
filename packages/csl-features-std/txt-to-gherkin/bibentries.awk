/>>.*BIBENTRIES.*>>/ {
  print "And the following bibliographic entries"
  print "  \"\"\""
  BIBENTRIES = 1
  next
}

/<<.*BIBENTRIES.*<</ {
  print "  \"\"\""
  BIBENTRIES = 0
}

BIBENTRIES {
  print "  " $0
}
