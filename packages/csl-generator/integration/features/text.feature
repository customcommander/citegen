Feature: Text

Scenario: text-case
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
          <text value="HELLO" text-case="lowercase"/>
          <text value=", "/>
          <text value="world" text-case="uppercase"/>
          <text value=", "/>
          <text value="hello world" text-case="capitalize-first"/>
          <text value=", "/>
          <text value="hello world" text-case="capitalize-all"/>
          <text value=", "/>
          <text value="FOO BAR BAZ" text-case="sentence"/>
          <text value=", "/>
          <text value="aaa bbb ccc" text-case="sentence"/>
          <text value=", "/>
          <text value="heal the world" text-case="title"/>
          <text value=", "/>
          <text value="intern, the" text-case="title"/>
          <text value=", "/>
          <text value="the intern" text-case="title"/>
        </layout>
      </citation>
    </style>
    """
  And the following document
    """
    [{}]
    """
  Then I expect the following citation
    """
    hello, WORLD, Hello world, Hello World, Foo bar baz, Aaa bbb ccc, Heal the World, Intern, The, The Intern
    """
