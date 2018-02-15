Feature: <citation>

Scenario: citation1
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
            <text variable="title"/>
        </layout>
      </citation>
    </style>
    """

Scenario: citation2
  Given the following citation style
    """
    <style 
      xmlns="http://purl.org/net/xbiblio/csl"
      class="note"
      version="1.0">
      <info>
        <id />
        <title />
        <updated>2009-08-10T04:49:00+09:00</updated>
      </info>
      <citation>
        <layout>
          <text variable="title"/>
        </layout>
      </citation>
    </style>
    """
