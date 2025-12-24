const cheerio = require('cheerio');

function parseHtml(html) {
  const $ = cheerio.load(html);

  return {
    title: $('title').text() || null,
    metaDescription: $('meta[name="description"]').attr('content') || null,
    headings: {
      h1: $('h1').map((_, el) => $(el).text()).get(),
      h2: $('h2').map((_, el) => $(el).text()).get(),
      h3: $('h3').map((_, el) => $(el).text()).get()
    },
    ctas: {
      buttons: $('button').map((_, el) => $(el).text().trim()).get(),
      links: $('a').map((_, el) => $(el).attr('href')).get()
    }
  };
}

module.exports = { parseHtml };
