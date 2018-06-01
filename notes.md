# Notes

These are personal notes taken while working on this project.
Their purposes is to keep track of findings, ideas and document decisions.

## csl-distribution

I had a go at using `parallel` in a NodeJS script:

```
find <all CSL files> | ./dist.js
```

dist.js:

```javascript
#!/usr/bin/parallel --shebang-wrap /usr/bin/node

// Some NodeJS script to convert a CSL file into a JS module,
// using `child_process.spawn` to invoke the `xsltproc` command
```

This took on average 4 times longer than: (the shell script took less than 2min on average to finish)

```
find <all CSL files> | parallel xsltproc -o <output_file> <xsl_file> <csl_file>
```

Conclusion: the shell script outperformed by large the equivalent NodeJS script.

However I must find a way to pull out the module.xsl file that ships with the `csl-generator` package.
Try using a postinstall script

