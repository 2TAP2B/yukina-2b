<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
          }
          
          .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
          }
          
          .header h1 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 2.2em;
          }
          
          .header p {
            margin: 0;
            color: #7f8c8d;
            font-size: 1.1em;
          }
          
          .feed-info {
            background: #3498db;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .feed-info h2 {
            margin: 0 0 10px 0;
            font-size: 1.2em;
          }
          
          .feed-info p {
            margin: 0;
            opacity: 0.9;
          }
          
          .posts {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .post {
            padding: 25px;
            border-bottom: 1px solid #ecf0f1;
          }
          
          .post:last-child {
            border-bottom: none;
          }
          
          .post-title {
            font-size: 1.3em;
            font-weight: 600;
            margin: 0 0 10px 0;
          }
          
          .post-title a {
            color: #2c3e50;
            text-decoration: none;
          }
          
          .post-title a:hover {
            color: #3498db;
          }
          
          .post-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 10px;
          }
          
          .post-description {
            color: #555;
            line-height: 1.6;
          }
          
          .rss-info {
            background: #2ecc71;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            text-align: center;
          }
          
          .rss-info a {
            color: white;
            text-decoration: underline;
          }
          
          @media (prefers-color-scheme: dark) {
            body { background: #1a1a1a; color: #e0e0e0; }
            .header, .posts { background: #2a2a2a; }
            .post-title a { color: #e0e0e0; }
            .post-title a:hover { color: #3498db; }
          }
        </style>
      </head>
      
      <body>
        <div class="header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
        </div>
        
        <div class="feed-info">
          <h2>📡 RSS Feed</h2>
          <p>This is an RSS feed. Subscribe to it in your favorite RSS reader to get updates when new posts are published.</p>
        </div>
        
        <div class="posts">
          <xsl:for-each select="/rss/channel/item">
            <div class="post">
              <h3 class="post-title">
                <a href="{link}" target="_blank">
                  <xsl:value-of select="title"/>
                </a>
              </h3>
              <div class="post-meta">
                Published: <xsl:value-of select="pubDate"/>
              </div>
              <xsl:if test="description">
                <div class="post-description">
                  <xsl:value-of select="description"/>
                </div>
              </xsl:if>
            </div>
          </xsl:for-each>
        </div>
        
        <div class="rss-info">
          <p>
            <strong>How to subscribe:</strong> Copy this page's URL and paste it into your RSS reader.
            Popular readers include <a href="https://feedly.com" target="_blank">Feedly</a>, 
            <a href="https://www.inoreader.com" target="_blank">Inoreader</a>, and 
            <a href="https://netnewswire.com" target="_blank">NetNewsWire</a>.
          </p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
