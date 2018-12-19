Feature: <label>

Scenario:
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl" default-locale="x-emoji">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <locale xml:lang="x-emoji">
        <terms>
          <term name="page">📖</term>
        </terms>
      </locale>
      <citation>
        <layout>
          <label variable="page"/>
          <text variable="page"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [{"page": "42"}]
    """
  Then the following result is expected
    """
    📖42
    """

