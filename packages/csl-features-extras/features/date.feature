Feature: <date>

Scenario: non-localized dates
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout delimiter=" | ">
          <choose>
            <if type="book">
              <date variable="issued" delimiter=" ">
                <date-part name="month" form="long"/>
                <date-part name="day"/>
                <date-part name="year"/>
              </date>
            </if>
            <else-if type="chapter">
              <date variable="accessed" delimiter=" ">
                <date-part name="day"/>
                <date-part name="month" form="long"/>
                <date-part name="year"/>
              </date>
            </else-if>
          </choose>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {
        "type": "book",
        "issued": {
          "date-parts": [
            [666, 1, 10]
          ]
        }
      },
      {
        "type": "chapter",
        "accessed": {
          "date-parts": [
            [-1666, 1, 10]
          ]
        }
      }
    ]
    """
  Then the following result is expected
    """
    January 10 666AD | 10 January -1666BC
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

Scenario: standard attributes on non-localized dates
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
          <date variable="issued" delimiter="/" text-case="uppercase" display="block" text-decoration="underline">
            <date-part name="month" form="long"/>
            <date-part name="day"/>
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
    <div class="csl-display-line"><span style="text-decoration:underline">JUNE/1</span></div>
    """

Scenario: Localised dates
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
        <date form="text">
          <date-part name="month"/>
          <date-part name="year"/>
        </date>
        <date form="numeric">
          <date-part name="year"/>
          <date-part name="month" form="short"/>
          <date-part name="day" form="ordinal"/>
        </date>
        <terms>
          <term name="month-01">🌯</term>
        </terms>
      </locale>
      <citation>
        <layout delimiter=" / ">
          <choose>
            <if type="book">
              <date variable="issued" form="text"/>
            </if>
            <else-if type="chapter">
              <date variable="accessed" form="numeric"/>
            </else-if>
            <else-if type="article">
              <date variable="submitted" form="numeric">
                <date-part name="month"/>
                <date-part name="year" form="short"/>
              </date>
            </else-if>
          </choose>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [
      {
        "type": "book",
        "issued": {
          "date-parts": [
            [2019, 1, 1]
          ]
        }
      },
      {
        "type": "chapter",
        "accessed": {
          "date-parts": [
            [2019, 2, 1]
          ]
        }
      },
      {
        "type": "article",
        "submitted": {
          "date-parts": [
            [2019, 3, 29]
          ]
        }
      }
    ]
    """
  Then the following result is expected
    """
    🌯2019 / 2019Feb.1st / 19Mar.29
    """
