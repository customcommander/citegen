#!/bin/sh

THIS_DIR=$(dirname $(realpath $0))
XSL_FILE=$(realpath $THIS_DIR/lib/module.xsl)
CSL_FILE=$(realpath $1 2>/dev/null)

test $? -ne 0 && echo "path no found: $1" && exit 1
test -f $CSL_FILE || (echo "file does not exist: $CSL_FILE" && exit 1)

xsltproc -o $2 $XSL_FILE $CSL_FILE 
