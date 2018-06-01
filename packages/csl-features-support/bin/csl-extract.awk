BEGIN {
  i=0
}

# using `/<style /` (with trailing space) to avoid matching `<style-options>` node.
/<style / {
  CSL=1
  i++
  csl_file=sprintf("/tmp/%s.%d.csl", basename, i)
  print "<!-- " NR " -->" > csl_file
}

CSL {
  print $0 > csl_file
}

/<\/style>/ {
  CSL=0
}
