<?xml version="1.0"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:csl="http://purl.org/net/xbiblio/csl"
  xmlns:str="http://exslt.org/strings"
  extension-element-prefixes="str">

  <xsl:output method="text" />

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
    <xsl:variable name="parent-path" select="str:tokenize(csl:info/csl:link[@rel='independent-parent']/@href, '/')[last()]"/>
    var parent = require('./<xsl:value-of select="$parent-path"/>');

    module.exports = {
      citation: function () {
        return parent.citation();
      }
    };
  </xsl:template>

</xsl:stylesheet>
