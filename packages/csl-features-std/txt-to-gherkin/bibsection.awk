/>>.*BIBSECTION.*>>/ {
  print "And the following bibliographic sections"
  print "  \"\"\""
  BIBSECTION = 1
  next
}

/<<.*BIBSECTION.*<</ {
  print "  \"\"\""
  BIBSECTION = 0
}

BIBSECTION {
  print "  " $0
}
