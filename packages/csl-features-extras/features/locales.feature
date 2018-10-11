Feature: Locales

Scenario: The default locale is taken from the style
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl" default-locale="fr-FR">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <citation>
        <layout>
          <text term="translator"/>
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
    traducteur
    """

Scenario: Style locales are supported
  Given the following citation style
    """
    <style class="note" version="1.0" xmlns="http://purl.org/net/xbiblio/csl" default-locale="x-emoji">
      <info>
        <id/>
        <title/>
        <updated>2008-10-29T21:01:24+00:00</updated>
      </info>
      <locale xml:lang="x-emoji">
        <terms>
          <term name="translator">:-)</term>
        </terms>
      </locale>
      <locale>
        <terms>
          <term name="editor">;-)</term>
        </terms>
      </locale>
      <citation>
        <layout>
          <text term="translator"/>
          <text value=", "/>
          <text term="editor"/>
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
    :-), ;-)
    """

Scenario: The default locale is used
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
          <text term="translator"/>
          <text value=", "/>
          <text term="editor"/>
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
    translator, editor
    """

Scenario: The locale can be specified at run time
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
          <text term="translator"/>
          <text value=", "/>
          <text term="editor"/>
        </layout>
      </citation>
    </style>
    """
  And the following data
    """
    [{}]
    """
  And the locale is set to "ja-JP"
  Then the following result is expected
    """
    翻訳者, 編
    """
