/>>.*RESULT.*>>/ {
  print "Then the following result is expected"
  print "  \"\"\""
  RESULT = 1
  next
}

/<<.*RESULT.*<</ {
  print "  \"\"\""
  RESULT = 0
}

RESULT {
  print "  " $0
}
