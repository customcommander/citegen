Feature: The CSL <number> Rendering Element

Scenario: Render numbers "as is" if they do not contain numeric content
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl" default-locale="fr">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout>
          <number variable="edition" prefix="(" suffix=")" text-case="uppercase" display="block" text-decoration="underline"/>
          <text value=" | "/>
          <number variable="issue" form="roman"/>
          <text value=" | "/>
          <number variable="volume" form="ordinal"/>
          <text value=" | "/>
          <number variable="chapter-number" form="long-ordinal"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [{
      "edition": "Second Edition",
      "issue": "1a,2&3",
      "volume": "1 - 17",
      "chapter-number": "1&2"
    }]
    """
  Then the following result is expected
    """
    (<div class="csl-display-line"><span style="text-decoration:underline">SECOND EDITION</span></div>) | 1a, II & III | 1ᵉʳ-17ᵉ | premier & deuxième
    """
