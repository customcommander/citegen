Feature: Layout

Scenario: Basic Layout Test
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout delimiter=", " prefix="(" suffix=")" text-decoration="underline">
          <text variable="title"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {"type":"book", "title": "hello"},
      {"type":"chapter", "title": "world"}
    ]
    """
  Then the following result is expected
    """
    (<span style="text-decoration:underline;">hello, world</span>)
    """
