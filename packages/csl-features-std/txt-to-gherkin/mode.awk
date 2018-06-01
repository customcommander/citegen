/>>.*MODE.*>>/ {
  MODE = 1
  next
}

/<<.*MODE.*<</ {
  MODE = 0
}

MODE {
  split(feature, features, "_")
  print "@" $0 " @" features[1]
  print "Feature: " features[2]
  print ""
  print "Scenario:"
}
