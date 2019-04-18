Feature: Names

Scenario: Renders only one name variable
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout>
          <names variable="author"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {
        "author": [
          {
            "given": "Jean",
            "family": "Fontaine",
            "dropping-particle": "de",
            "non-dropping-particle": "La",
            "suffix": "I"
          },
          {
            "given": "Jean",
            "family": "Fontaine",
            "dropping-particle": "de",
            "non-dropping-particle": "La",
            "suffix": "II"
          }
        ]
      }
    ]
    """
  Then the following result is expected
    """
    Jean de La Fontaine I, Jean de La Fontaine II
    """
