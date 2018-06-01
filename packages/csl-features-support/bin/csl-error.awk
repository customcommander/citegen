{
  sprintf("awk 'NR==1{print $2}' %s", $1) | getline line_number_offset
  line_number=int(line_number_offset) + int($2) - 2
  col_number=$3

  for (i=4; i<=NF; i++) {
    if (i==4) {
      err_msg=$i
    } else {
      err_msg=err_msg ":" $i
    }
  }

  print file ":" line_number ":" col_number ":" err_msg
}

END {
  exit 1
}