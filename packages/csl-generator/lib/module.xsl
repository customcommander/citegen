<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl">

  <xsl:output method="text" />

  <xsl:template name="import-parent-style">
    <xsl:param name="path"/>
    <xsl:choose>
      <xsl:when test="contains($path, '/')">
        <xsl:call-template name="import-parent-style">
          <xsl:with-param name="path" select="substring-after($path, '/')"/>
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$path"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="csl:style">
    var csl_locales = require('@customcommander/csl-locales');
    var csl_lib = require('@customcommander/csl-lib');

    module.exports = {
      citation: function () {
        return csl_lib.citation();
      }
    };
  </xsl:template>

  <xsl:template match="csl:style[csl:info[csl:link[@rel='independent-parent']]]">
    <xsl:variable name="parent-path">
      <xsl:call-template name="import-parent-style">
        <xsl:with-param name="path" select="csl:info/csl:link[@rel='independent-parent']/@href"/>
      </xsl:call-template>
    </xsl:variable>
    var parent = require('./<xsl:value-of select="$parent-path"/>');

    module.exports = {
      citation: function () {
        return parent.citation();
      }
    };
  </xsl:template>

</xsl:stylesheet>
