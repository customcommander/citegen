/>>.*CITATION-ITEMS.*>>/ {
  print "And the following citations items"
  print "  \"\"\""
  CITATION_ITEMS = 1
  next
}

/<<.*CITATION-ITEMS.*<</ {
  print "  \"\"\""
  CITATION_ITEMS = 0
}

CITATION_ITEMS {
  print "  " $0
}
