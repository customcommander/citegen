/>>.*OPTIONS.*>>/ {
  print "And the following options"
  print "  \"\"\""
  OPTIONS = 1
  next
}

/<<.*OPTIONS.*<</ {
  print "  \"\"\""
  OPTIONS = 0
}

OPTIONS {
  print "  " $0
}
