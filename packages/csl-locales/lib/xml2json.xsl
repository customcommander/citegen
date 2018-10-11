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
    <xsl:apply-templates select="csl:info"/>
    <xsl:if test="@xml:lang">
      <xsl:apply-templates select="@xml:lang"/>
      <xsl:text>,</xsl:text>
    </xsl:if>
    <xsl:for-each select="csl:style-options|csl:date|csl:terms">
      <xsl:apply-templates select="."/><xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>
  }
  </xsl:template>

  <xsl:template match="csl:info">
    <xsl:for-each select="*">
      <xsl:call-template name="string-property-json-line">
        <xsl:with-param name="name" select="concat('/** ', position(), ' **/')"/>
        <xsl:with-param name="value">
          <xsl:apply-templates select="."/>
        </xsl:with-param>
      </xsl:call-template>
      <xsl:text>,</xsl:text>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="csl:updated">
    <xsl:value-of select="concat('Last Updated: ', .)"/>
  </xsl:template>

  <xsl:template match="csl:rights">
    <xsl:value-of select="."/>
    <xsl:if test="@license">
      <xsl:text> (</xsl:text>
      <xsl:value-of select="@license"/>
      <xsl:text>)</xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="csl:translator">
    <xsl:text>Translator: </xsl:text>
    <xsl:value-of select="csl:name"/>
    <xsl:if test="csl:email">
      <xsl:text>, </xsl:text>
      <xsl:value-of select="csl:email"/>
    </xsl:if>
    <xsl:if test="csl:uri">
      <xsl:text>, </xsl:text>
      <xsl:value-of select="csl:uri"/>
    </xsl:if>
  </xsl:template>

  <xsl:template match="csl:style-options">
    "style_options": <xsl:apply-templates select="." mode="object"/>
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

  <xsl:template name="string-property-json-line">
    <xsl:param name="name"/>
    <xsl:param name="value"/>
    <xsl:variable name="double-quote">"</xsl:variable>
    <xsl:variable name="double-quote-escaped">\"</xsl:variable>
    <xsl:text>"</xsl:text><xsl:value-of select="$name"/><xsl:text>"</xsl:text>
    <xsl:text>:</xsl:text>
    <xsl:text>"</xsl:text><xsl:value-of select="str:replace($value, $double-quote, $double-quote-escaped)" /><xsl:text>"</xsl:text>
  </xsl:template>

</xsl:stylesheet>
