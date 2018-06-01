#!/bin/sh

if [ ! -f $1 ]; then
  echo "file does not exist: $1"
  exit 1
fi

grep -q "<style" $1

if [ $? -ne 0 ]; then
  echo "no citation style found: $1"
  exit 0
fi

this_dir=$(dirname $(realpath $0))
basename=$(basename $1)

awk -v path=$(realpath $1) -v basename=$basename -f $this_dir/csl-extract.awk $1

find /tmp -type f -name "$basename*.csl" -print0 | xargs -0 -r -I{} -n 1 sh -c 'jing -c /var/csl/csl.rnc $1 >$1.err 2>/dev/null' -- {}
find /tmp -type f -name "$basename*.csl.err" -not -empty -print0 | xargs -0 -r -I{} -n 1 sh -c 'awk -F: -v file='$1' -f '$this_dir'/csl-error.awk $1' -- {}

csl_valid=$?

find /tmp -type f -name "$basename*" -print0 | xargs -0 -r -n 1 rm

if [ $csl_valid -eq 0 ]; then
  exit 0
else
  exit 1
fi
