/>>.*CSL.*>>/ {
  print "Given the following citation style"
  print "  \"\"\""
  CSL = 1
  next
}

/<<.*CSL.*<</ {
  print "  \"\"\""
  CSL = 0
}

CSL {
  print "  " $0
}
