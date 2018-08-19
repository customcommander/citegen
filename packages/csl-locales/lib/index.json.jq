# This jq script transforms 'vendor/locales/locales.json'
# into 'packages/csl-locales/lib/index.json' which is used to associate
# dialects to languages.
. | [

      [
        .["primary-dialects"]
        | with_entries(.value |= {primary: [.]})
      ],

      [
        .["language-names"]
        | to_entries
        | group_by(.key | split("-") | first)
        | map_values(
            map_values(.key)
            | {key: (.[0] | split("-") | first),
               value: {secondary: .}})
        | from_entries
      ]
    ]

  | .[0][0] * .[1][0]

  | with_entries(.value |= .primary + (.secondary - .primary))
