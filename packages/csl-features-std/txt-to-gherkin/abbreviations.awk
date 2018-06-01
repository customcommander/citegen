/>>.*ABBREVIATIONS.*>>/ {
  print "And the following abbreviations"
  print "  \"\"\""
  ABBREVIATIONS = 1
  next
}

/<<.*ABBREVIATIONS.*<</ {
  print "  \"\"\""
  ABBREVIATIONS = 0
}

ABBREVIATIONS {
  print "  " $0
}
