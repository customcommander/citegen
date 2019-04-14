Feature: <macro>

Scenario: A very simple macro
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <macro name="the-answer">
        <text value="42"/>
      </macro>
      <citation>
        <layout>
            <text macro="the-answer"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [{}]
    """
  Then the following result is expected
    """
    42
    """

