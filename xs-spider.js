const cheerio = require('cheerio');
const axios = require('axios').default;
const mongoose = require('mongoose');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const { Book, BookCategory, BookChapter } = require('./models');

mongoose.connect('mongodb://localhost:27017/cat-shop').then((res) => {
  const removeAll = Promise.all([
    BookCategory.remove({}),
    Book.remove({}),
    BookChapter.remove({})
  ]);
  removeAll
    .then((res) => {
      console.log(res);
      loadData();
      // BookCategory.find({}).then(types => {
      //   if (types.length == 0) {
      //     loadData();
      //   } else {
      //     for (var i = 0; i < types.length; i++) {
      //       loadBook(types[i]);
      //     }
      //   }
      // });
    })
    .catch((err) => console.log(err));
});

function loadData() {
  try {
    const types = [
      {
        name: '玄幻魔法',
        url: 'https://www.yanqing-888.net/xiaoshuo3/'
      },
      {
        name: '武侠修真',
        url: 'https://www.yanqing-888.net/xiaoshuo2/'
      },
      {
        name: '历史军事',
        url: 'https://www.yanqing-888.net/xiaoshuo4/'
      },
      {
        name: '恐怖悬疑',
        url: 'https://www.yanqing-888.net/xiaoshuo5/'
      },
      {
        name: '网友动漫',
        url: 'https://www.yanqing-888.net/xiaoshuo6/'
      },
      {
        name: '科幻小说',
        url: 'https://www.yanqing-888.net/xiaoshuo7/'
      }
    ];
    BookCategory.insertMany(types)
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          loadBook(res[i]);
        }
      })
      .catch((e) => console.log(e));
  } catch (err) {
    console.log(err);
  }
}

function fetchData(url) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11',
    'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0',
    'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)'
  ];
  return new Promise((reslove, reject) => {
    setTimeout(function () {
      axios
        .get(url, {
          timeout: 500000,
          headers: {
            'user-agent':
              userAgents[Math.floor(Math.random() * userAgents.length)],
            'X-FORWARDED-FOR':
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255),
            'CLIENT-IP':
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255) +
              '.' +
              Math.floor(Math.random() * 255)
          }
        })
        .then((res) => reslove(res))
        .catch((e) => reject(e));
    }, Math.random() * 1000 * Math.random());
  });
}

/**
 * 下载书籍信息
 * @param {*} param0
 * @param {*} isFirst
 */
function loadBook({ url, id }, isFirst = true) {
  try {
    fetchData(url).then((res) => {
      const $ = cheerio.load(res.data.toString());
      const books = [];
      if (isFirst) {
        const $tagBooks = $('#newscontent .l li');
        $tagBooks.each(function () {
          const book = {};
          book.title = $(this).find('.s2 a').text();
          book.url =
            'https://www.yanqing-888.net' + $(this).find('.s2 a').attr('href');
          book.author = $(this).find('.s4').text();
          // console.log(book);
          book.category = id;
          books.push(book);
        });
      } else {
        const $tagBooks = $('.novelslist2 li');

        $tagBooks.each(function (index) {
          if (index > 0) {
            const book = {};
            book.title = $(this).find('.s2 a').text();
            book.url =
              'https://www.yanqing-888.net' +
              $(this).find('.s2 a').attr('href');
            book.author = $(this).find('.s4 a').text();
            book.category = id;
            // console.log(book);
            books.push(book);
          }
        });
      }
      console.log(books.length);
      Book.insertMany(books)
        .then((endBooks) => {
          // 插入书籍信息
          for (var i = 0; i < endBooks.length; i++) {
            loadZJ(endBooks[i]);
          }
        })
        .catch((e) => console.log(e));
      const nextpage = $('#pagelink strong').next().attr('href');
      if (nextpage) {
        if (nextpage.split('_').splice(-1)[0].replace('/', '') * 1 < 15) {
          loadBook(
            { url: 'https://www.yanqing-888.net' + nextpage, id },
            false
          );
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 下载数据的详情和章节
 * @param {*} book 书籍模型
 */
function loadZJ(book) {
  fetchData(book.url)
    .then((res) => {
      const $ = cheerio.load(res.data.toString());
      const $allZJ = $('#list dt').eq(1).nextAll().find('a');
      var imgSrc = $('#fmimg img').attr('src');
      if (imgSrc.startsWith('http')) {
        book.coverImg = imgSrc;
      } else {
        book.coverImg = 'https://www.yanqing-888.net' + imgSrc;
      }

      book.descriptions = $('#intro p').eq(0).text();
      console.log(book);
      book.save().then((e) => {});
      const allZJ = [];
      $allZJ.each(function () {
        const zj = {};
        zj.title = $(this).text();
        zj.url = 'https://www.yanqing-888.net' + $(this).attr('href');
        zj.book = book.id;
        allZJ.push(zj);
      });
      BookChapter.insertMany(allZJ).then((zjEnd) =>
        console.log('保存章节成功')
      );
    })
    .catch((e) => console.log(e));
}

/**
 * 下载章节详情
 * @param {*} bc 章节模型
 */
function loadChapter(bc) {
  fetchData(bc.url).then((res) => {
    const $ = cheerio.load(res.data.toString());
    $('#content p').eq(-1).remove();
    const content = $('#content').html();
    console.log(entities.decode(content));
  });
}
