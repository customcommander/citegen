Feature: <citation>

Scenario: A very simple citation style
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout prefix="(" delimiter="," suffix=")">
            <text value="a"/>
        </layout>
      </citation>
    </style>
    """
  And the following document
    """
    [{},{}]
    """
  Then I expect the following citation
    """
    (a,a)
    """

