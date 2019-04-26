'use strict';

/*
 * Return the proper parseList function according to the options.
 */
function getParseList (getApp, opts) {
  if (opts.fullDetail) {
    return getParseDetailList(getApp, opts);
  }

  return ($) => Promise.resolve(parseList($));
}

/*
 * Returns a parseList function that just grabs the appIds,
 * fetches every app detail with the app() function and returns
 * a Promise.all().
 */
function getParseDetailList (getApp, opts) {
  return function ($) {
    const promises = $('.Vpfmgd').get().slice(0, opts.num).map(function (app) {
      const appId = $(app).attr('data-docid');
      return getApp({
        appId: appId,
        lang: opts.lang,
        country: opts.country,
        cache: opts.cache
      });
    });

    return Promise.all(promises);
  };
}

function parseList ($) {
  return $('.Vpfmgd').get().map(function (app) {
    // console.log(app);
    return parseApp($(app));
  });
}

function parseApp (app) {
  let price = app.find('.VfPpfd.ZdBevf.i5DZme').text();

  // if price string contains numbers, it's not free
  const free = !/\d/.test(price);

  const scoreText = app.find('.pf5lIe div[role=img]').attr('aria-label');
  let score;
  if (scoreText) {
    score = parseFloat(scoreText.match(/[\d.]+/)[0]);
  }

  return {
    url: 'https://play.google.com' + app.find('.poRVub').attr('href'),
    appId: app.find('.poRVub').attr('href').split('id=')[1],
    title: app.find('.Q9MA7b').attr('title'),
    summary: app.find('.b8cIId').text().trim(),
    developer: app.find('.mnKHRc').text(),
    developerId: app.find('a.mnKHRc').attr('href').split('id=')[1],
    icon: app.find('.kJ9uy img').attr('data-src'),
    score: score,
    scoreText: scoreText,
    priceText: price,
    free: free
  };
}

module.exports = getParseList;
