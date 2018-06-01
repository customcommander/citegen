#!/bin/sh

script_dir=$(dirname $0)
txt_file=$1

awk -v feature=$(basename $txt_file .txt) -f $script_dir/mode.awk $txt_file
awk -f $script_dir/csl.awk $txt_file
awk -f $script_dir/input.awk $txt_file
awk -f $script_dir/input2.awk $txt_file
awk -f $script_dir/citation-items.awk $txt_file
awk -f $script_dir/citations.awk $txt_file
awk -f $script_dir/abbreviations.awk $txt_file
awk -f $script_dir/bibentries.awk $txt_file
awk -f $script_dir/bibsection.awk $txt_file
awk -f $script_dir/options.awk $txt_file
awk -f $script_dir/result.awk $txt_file
