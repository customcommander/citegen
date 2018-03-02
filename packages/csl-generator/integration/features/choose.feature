Feature: <choose>

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
        <layout>
            <choose>
              <if type="article">
                <text value="foo"/>
                <text value="bar"/>
              </if>
            </choose>
        </layout>
      </citation>
    </style>
    """
  And the following document
    """
    [{"type": "article"}]
    """
  Then I expect the following citation
    """
    foobar
    """

