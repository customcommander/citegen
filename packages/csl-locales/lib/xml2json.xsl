<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  extension-element-prefixes="str">

  <xsl:output method="text" encoding="UTF-8" indent="yes"/>

  <xsl:template match="csl:locale">
  {
    <xsl:if test="@xml:lang">
      <xsl:apply-templates select="@xml:lang"/>,
    </xsl:if>
    "translators": [
      <xsl:for-each select="csl:info/csl:translator">
        <xsl:apply-templates select="."/>
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    ],
    "license": "<xsl:value-of select="csl:info/csl:rights/@license"/>",
    "last_updated": "<xsl:value-of select="csl:info/csl:updated"/>",
    <xsl:for-each select="csl:style-options|csl:date|csl:terms">
      <xsl:apply-templates select="."/><xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
  }
  </xsl:template>

  <xsl:template match="csl:info">
  </xsl:template>


  <xsl:template match="csl:translator">
    {
      "name": "<xsl:value-of select="csl:name"/>"
      <xsl:if test="csl:email">
      ,"email": "<xsl:value-of select="csl:email"/>"
      </xsl:if>
      <xsl:if test="csl:uri">
      ,"uri": "<xsl:value-of select="csl:uri"/>"
      </xsl:if>
    }
  </xsl:template>

  <xsl:template match="csl:style-options">
    "style_options": <xsl:apply-templates select="." mode="object"/>
  </xsl:template>

  <xsl:template match="csl:style-options" mode="object">
    {
      <xsl:apply-templates select="." mode="kv-limit"/>,
      <xsl:apply-templates select="." mode="kv-punctuation"/>
    }
  </xsl:template>


  <xsl:template match="csl:date">
    "date_<xsl:value-of select="@form"/>": [
      <xsl:for-each select="csl:date-part">
        <xsl:apply-templates select="." mode="object"/><xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    ]
  </xsl:template>

  <xsl:template match="csl:terms">
    "terms": [
      <xsl:for-each select="csl:term">
        <xsl:sort select="@name"/>
        <xsl:apply-templates select="." mode="object"/>
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    ]
  </xsl:template>

  <xsl:template match="csl:term" mode="object">
    {
      <xsl:apply-templates select="." mode="kv-name"/>,
      <xsl:apply-templates select="." mode="kv-form"/>,
      <xsl:if test="starts-with(@name, 'ordinal-') or starts-with(@name, 'long-ordinal-')">
        <xsl:apply-templates select="." mode="kv-match"/>,
      </xsl:if>
      <xsl:apply-templates select="." mode="kv-gender"/>,
      <xsl:apply-templates select="." mode="kv-value"/>
    }
  </xsl:template>

  <xsl:template match="csl:*" mode="object">
    <xsl:variable name="keysvalues">

      <xsl:for-each select="@*">
        <xsl:apply-templates select="."/>
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>

      <xsl:choose>

        <xsl:when test="csl:single">
          <xsl:text>,</xsl:text>
          <xsl:call-template name="string-property-json-line">
            <xsl:with-param name="name" select="'single'"/>
            <xsl:with-param name="value" select="string(csl:single)"/>
          </xsl:call-template>
          <xsl:text>,</xsl:text>
          <xsl:call-template name="string-property-json-line">
            <xsl:with-param name="name" select="'multiple'"/>
            <xsl:with-param name="value" select="string(csl:multiple)"/>
          </xsl:call-template>
        </xsl:when>

        <xsl:when test="text()">
          <xsl:text>,</xsl:text>
          <xsl:call-template name="string-property-json-line">
            <xsl:with-param name="name" select="'single'"/>
            <xsl:with-param name="value" select="string(.)"/>
          </xsl:call-template>
        </xsl:when>

      </xsl:choose>

    </xsl:variable>

    {<xsl:value-of select="$keysvalues"/>}
  </xsl:template>

  <xsl:template match="@*">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="name()"/>
      <xsl:with-param name="value" select="."/>
    </xsl:call-template>
  </xsl:template>

  <!-- <style-options> attributes -->

  <xsl:template match="csl:style-options[@limit-day-ordinals-to-day-1]" mode="kv-limit">
    <xsl:apply-templates select="@limit-day-ordinals-to-day-1"/>
  </xsl:template>

  <xsl:template match="csl:style-options[not(@limit-day-ordinals-to-day-1)]" mode="kv-limit">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'limit-day-ordinals-to-day-1'"/>
      <xsl:with-param name="value" select="'false'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:style-options[@punctuation-in-quote]" mode="kv-punctuation">
    <xsl:apply-templates select="@punctuation-in-quote"/>
  </xsl:template>

  <xsl:template match="csl:style-options[not(@punctuation-in-quote)]" mode="kv-punctuation">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'punctuation-in-quote'"/>
      <xsl:with-param name="value" select="'false'"/>
    </xsl:call-template>
  </xsl:template>

  <!-- <term> attributes -->

  <xsl:template match="csl:term" mode="kv-name">
    <xsl:apply-templates select="@name"/>
  </xsl:template>

  <xsl:template match="csl:term" mode="kv-form">
    <xsl:apply-templates select="@form"/>
  </xsl:template>

  <xsl:template match="csl:term[not(@form)]" mode="kv-form">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'form'"/>
      <xsl:with-param name="value" select="'long'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:term[starts-with(@name, 'long-ordinal-')]" mode="kv-match">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'match'"/>
      <xsl:with-param name="value" select="'whole-number'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:term[starts-with(@name, 'ordinal-')]" mode="kv-match">
    <xsl:apply-templates select="@match"/>
  </xsl:template>

  <xsl:template match="csl:term[starts-with(@name, 'ordinal-') and not(@match)]" mode="kv-match">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'match'"/>
      <xsl:with-param name="value">
        <xsl:choose>
          <xsl:when test="contains(@name, '00') or contains(@name, '01') or contains(@name, '02') or contains(@name, '03') or contains(@name, '04') or contains(@name, '05') or contains(@name, '06') or contains(@name, '07') or contains(@name, '08') or contains(@name, '09')">last-digit</xsl:when>
          <xsl:otherwise>last-two-digits</xsl:otherwise>
        </xsl:choose>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:term[not(starts-with(@name, 'ordinal-')) and not(starts-with(@name, 'long-ordinal-'))]" mode="kv-gender">
    <xsl:apply-templates select="@gender"/>
  </xsl:template>

  <xsl:template match="csl:term[not(starts-with(@name, 'ordinal-')) and not(starts-with(@name, 'long-ordinal-')) and not(@gender)]" mode="kv-gender">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'gender'"/>
      <xsl:with-param name="value" select="'neuter'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:term[starts-with(@name, 'ordinal-') or starts-with(@name, 'long-ordinal')]" mode="kv-gender">
    <xsl:apply-templates select="@gender-form"/>
  </xsl:template>

  <xsl:template match="csl:term[(starts-with(@name, 'ordinal-') or starts-with(@name, 'long-ordinal')) and not(@gender-form)]" mode="kv-gender">
    <xsl:call-template name="string-property-json-line">
      <xsl:with-param name="name" select="'gender-form'"/>
      <xsl:with-param name="value" select="'neuter'"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="csl:term" mode="kv-value">
    "value": [
      <xsl:choose>
        <xsl:when test="not(csl:single) and not(csl:multiple)">
          "<xsl:call-template name="escape-quote"><xsl:with-param name="str" select="."/></xsl:call-template>"
        </xsl:when>
        <xsl:when test="csl:single and csl:multiple">
          "<xsl:call-template name="escape-quote"><xsl:with-param name="str" select="csl:single"/></xsl:call-template>",
          "<xsl:call-template name="escape-quote"><xsl:with-param name="str" select="csl:multiple"/></xsl:call-template>"
        </xsl:when>
        <xsl:when test="csl:single">
          "<xsl:call-template name="escape-quote"><xsl:with-param name="str" select="csl:single"/></xsl:call-template>"
        </xsl:when>
      </xsl:choose>
    ]
  </xsl:template>

  <xsl:template name="escape-quote">
    <xsl:param name="str"/>
    <xsl:variable name="double-quote">"</xsl:variable>
    <xsl:variable name="double-quote-escaped">\"</xsl:variable>
    <xsl:value-of select="str:replace($str, $double-quote, $double-quote-escaped)" />
  </xsl:template>

  <xsl:template name="string-property-json-line">
    <xsl:param name="name"/>
    <xsl:param name="value"/>
    "<xsl:value-of select="$name"/>":
    "<xsl:call-template name="escape-quote"><xsl:with-param name="str" select="$value"/></xsl:call-template>"
  </xsl:template>

</xsl:stylesheet>
