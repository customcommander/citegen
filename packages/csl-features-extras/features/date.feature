Feature: <date>

Scenario: The order of <date-parts> elements matter when rendering an unlocalized date
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
          <date variable="issued" delimiter=" ">
            <date-part name="month" form="long"/>
            <date-part name="day"/>
            <date-part name="year"/>
          </date>
          <text value=" | "/>
          <date variable="issued" delimiter=" ">
            <date-part name="day"/>
            <date-part name="month" form="long"/>
            <date-part name="year"/>
          </date>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {
        "issued": {
          "date-parts": [
            [2019, 1, 10]
          ]
        }
      }
    ]
    """
  Then the following result is expected
    """
    January 10 2019 | 10 January 2019
    """

Scenario: Make sure that date-parts form variants are all covered
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl" default-locale="x-emoji">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <locale xml:lang="x-emoji">
        <style-options limit-day-ordinals-to-day-1="true"/>
        <terms>
          <term name="ordinal-01">👍</term>
        </terms>
      </locale>
      <citation>
        <layout>
          <date variable="issued" delimiter=", ">
            <date-part name="year"/><!-- default is long -->
            <date-part name="year" form="long"/>
            <date-part name="year" form="short"/>
          </date>
          <text value=" | "/>
          <date variable="issued" delimiter=", ">
            <date-part name="month"/><!-- default is long -->
            <date-part name="month" form="long"/>
            <date-part name="month" form="short"/>
            <date-part name="month" form="numeric"/>
            <date-part name="month" form="numeric-leading-zeros"/>
          </date>
          <text value=" | "/>
          <date variable="issued" delimiter=", ">
            <date-part name="day"/><!-- default is numeric -->
            <date-part name="day" form="numeric"/>
            <date-part name="day" form="numeric-leading-zeros"/>
            <date-part name="day" form="ordinal"/>
          </date>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {
        "issued": {
          "date-parts": [
            [2019, 6, 1]
          ]
        }
      }
    ]
    """
  Then the following result is expected
    """
    2019, 2019, 19 | June, June, Jun., 6, 06 | 1, 1, 01, 1👍
    """

