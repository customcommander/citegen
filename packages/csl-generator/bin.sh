#!/bin/sh

csl_file=$1
xsl_path=$(dirname $(realpath $0))/lib/module.xsl

# if csl file exists and is not empty
if [ -s $csl_file ]; then
  xsltproc $xsl_path $csl_file
  exit $0
else
  echo "file not found: $csl_file" 1>&2
  exit 1
fi
