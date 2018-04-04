<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  extension-element-prefixes="str">

  <xsl:output method="text" />

  <xsl:template match="csl:*" mode="param-attrs">
    {<xsl:for-each select="@*">
      '<xsl:value-of select="name()"/>': '<xsl:value-of select="."/>'
      <xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>}
  </xsl:template>

  <xsl:template match="csl:*" mode="param-children">
    [<xsl:for-each select="csl:*">
      <xsl:apply-templates select="." mode="function-call"/>
      <xsl:if test="position() != last()">,</xsl:if>
    </xsl:for-each>]
  </xsl:template>

  <xsl:template match="csl:*" mode="function-call">
    <xsl:variable name="fnName">
      <xsl:choose>
        <xsl:when test="name() = 'if'">ifFn</xsl:when>
        <xsl:when test="name() = 'else-if'">elseIf</xsl:when>
        <xsl:otherwise><xsl:value-of select="name()"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    lib.<xsl:value-of select="$fnName"/>(locales, macros,
      <xsl:apply-templates select="self::node()" mode="param-attrs"/>,
      <xsl:apply-templates select="self::node()" mode="param-children"/>)
  </xsl:template>

  <xsl:template match="csl:style">
    var lib = require('@customcommander/csl-lib');

    var locales = [
      require('@customcommander/csl-locales')['en-US']
    ];

    var macros = {};

    module.exports = {
      citation: function (refs) {
        return lib.citation(locales, macros, {},
          <xsl:apply-templates select="csl:citation" mode="param-children"/>, refs);
      }
    };
  </xsl:template>

  <xsl:template match="csl:style[csl:info[csl:link[@rel='independent-parent']]]">
    <xsl:variable name="parent-path" select="str:tokenize(csl:info/csl:link[@rel='independent-parent']/@href, '/')[last()]"/>
    var parent = require('./<xsl:value-of select="$parent-path"/>');

    module.exports = {
      citation: function (refs) {
        return parent.citation(refs);
      }
    };
  </xsl:template>

</xsl:stylesheet>
