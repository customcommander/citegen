<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  extension-element-prefixes="str">

  <xsl:output method="text" />

  <xsl:template match="csl:text">
    csl_lib.text({
      value: '<xsl:value-of select="@value"/>'
    }, [])
  </xsl:template>

  <xsl:template match="csl:layout">
    csl_lib.layout({
      <xsl:for-each select="@*">
        '<xsl:value-of select="name()"/>': '<xsl:value-of select="."/>'
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    }, [
      <xsl:for-each select="*">
        <xsl:apply-templates select="."/>
        <xsl:if test="position() != last()">,</xsl:if>
      </xsl:for-each>
    ])
  </xsl:template>

  <xsl:template match="csl:style">
    var csl_locales = require('@customcommander/csl-locales');
    var csl_lib = require('@customcommander/csl-lib');

    module.exports = {
      citation: function (refs) {
        return csl_lib.citation({}, [<xsl:apply-templates select="csl:citation/csl:layout"/>], refs);
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
