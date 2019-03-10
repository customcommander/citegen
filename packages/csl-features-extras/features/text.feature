Feature: Text Node

Scenario: attributes
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
          <text value="H.E.L.L.O" text-case="lowercase" display="block" strip-periods="true"/>
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
    <div class="csl-display-line">hello</div>
    """
