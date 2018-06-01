# About

This document contains notes, questions and thoughts while working at converting
the `citation-style-language/test-suite` format into Gherkin.

Documentation about `citation-style-language/test-suite` can be found here:
https://github.com/citation-style-language/test-suite

### Available Sections

I ran an `awk` script across all files in `test-suite/processor-tests/humans` and found the following sections:

| Name           | Comment          |
|:---------------|:-----------------|
| ABBREVIATIONS  | Undocumented.    |
| BIBENTRIES     | LEARN MORE       |
| BIBSECTION     | LEARN MORE       |
| CITATION-ITEMS | LEARN MORE       |
| CITATIONS      | LEARN MORE       |
| CSL            | Required.        |
| INPUT          | Required.        |
| INPUT2         | Undocumented.    |
| MODE           | Required.        |
| OPTIONS        | Undocumented.    |
| RESULT         | Required.        |

### Available Modes

I ran the following script to get a list of all modes:

```
find ../../vendor/test-suite/processor-tests/humans -type f -name "*.txt" -exec awk '/>>.*MODE.*>>/{echo=1;next} /<<.+MODE.+<</{echo=0;next} echo' {} \; | sort -u
```

Here were the results:

| Mode                | Comment                   |
|:--------------------|:--------------------------|
| bibliography        |                           |
| bibliography-header | I don't know what that is |
| bibliography-nosort | I don't know what that is |
| citation            |                           |
| citation-rtf        | I don't know what that is |

### TODO/IDEAS

1. Validate CSL
2. Validate all JSON data
