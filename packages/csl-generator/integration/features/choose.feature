Feature: <choose>

Scenario: choose with a single if statement
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout delimiter=", ">
            <choose>
              <if type="article">
                <text value="art"/>
                <text value="icle"/>
              </if>
              <else-if type="book" is-numeric="edition">
                <text value="bo"/>
                <text value="ok"/>
              </else-if>
              <else-if type="article" is-numeric="edition" match="any">
                <text value="foo"/>
                <text value="bar"/>
              </else-if>
            </choose>
            <choose>
              <if type="article book" match="none">
                <text value="chapter"/>
              </if>
            </choose>
        </layout>
      </citation>
    </style>
    """
  And the following documents
    """
    [
      {"type": "article"},
      {"type": "book", "edition": "2nd"},
      {"type": "chapter"}
    ]
    """
  Then I expect the following citation
    """
    article, book, chapter
    """
