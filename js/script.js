'use strict';

function titleClickHandler(event) {
  event.preventDefault();
  console.log('Link was clicked!');
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}




const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const optAuthorsListSelector = '.authors';
const optTagsListSelector = '.tags';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';


function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  console.log(optArticleSelector + customSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(articles);

  let html = '';

  /* remove contents of titleList */
  titleList.innerHTML = '';

  /* for each article */
  for (let article of articles) {

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const titleElement = article.querySelector(optTitleSelector);

    /* get the title from the title element */
    const articleTitle = titleElement.innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into titleList */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagAndAuthorsClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  console.log(classNumber);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      /* add generated code to html variable */
      html = html + linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  console.log(tagList);


  const tagsParams = calculateTagsAndAuthorsParams(allTags);
  console.log(tagsParams);

  /* [NEW] add html from allTags to tagList */
  let allTagsHTML = '';

  for (let tag in allTags) {
    const tagLinkHTML = '<li><a class="' + calculateTagAndAuthorsClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">' + tag + '</a></li>';
    allTagsHTML += tagLinkHTML;
  }

  tagList.innerHTML = allTagsHTML;
}

function calculateTagsAndAuthorsParams(tags) {
  const params = { max: 0, min: 999999 };

  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

generateTags();


function tagClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.substring(5);

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags) {

    /* remove class active */
    activeTag.classList.remove('active');

    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefTags = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let hrefTag of hrefTags) {

    /* add class active */
    hrefTag.classList.add('active');

    /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }

}

addClickListenersToTags();


function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {

    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    const articleAuthor = article.getAttribute('data-author');

    const linkHTML = '<li><a href="' + articleAuthor + '">' + articleAuthor + '</a></li>';
    authorWrapper.innerHTML = linkHTML;

    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
  }
  console.log(allAuthors);

  const authorsList = document.querySelector(optAuthorsListSelector);
  const tagsParams = calculateTagsAndAuthorsParams(allAuthors);
  console.log(tagsParams);
  let allAuthorsHTML = '';

  for (let tag in allAuthors) {
    const authorLinkHTML = '<li><a class="' + calculateTagAndAuthorsClass(allAuthors[tag], tagsParams) + '" href="' + tag + '">' + tag + '</a></li>';
    allAuthorsHTML += authorLinkHTML;
  }

  authorsList.innerHTML = allAuthorsHTML;
}

generateAuthors();

function addClickListenersToAuthors() {
  const authors = document.querySelectorAll('.post-author a, .authors a');

  /* START LOOP: for each link */
  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const author = clickedElement.getAttribute('href');
  const activeAuthors = document.querySelectorAll('.post-author .active');

  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }

  const hrefAuthors = document.querySelectorAll('a[href="' + author + '"]');

  for (let hrefAuthor of hrefAuthors) {
    hrefAuthor.classList.add('active');
  }

  generateTitleLinks('[data-author="' + author + '"]');
}





