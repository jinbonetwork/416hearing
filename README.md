# 416hearing

## 시스템
* 인스톨: `npm install`
* 개발할 때: `npm start`
* 배포할 때: `npm run build`

## 2차 청문회 페이지 증인 관련 파일
* 마크업: `/2nd-hearing/index.html`
* 스타일: `/2nd-hearing/widtnesses.less`
* 스크립트: `/2nd-hearing/widtnesses.js`
* 증인정보: `/data/2nd_hearing/witnesses.json`
* 증인프로필사진이 있는 곳: `/data/2nd_hearing/images`

## 그 밖의 관련 파일
* 스타일
  * `/css/style.less`
  * `/css/variables.less`
  * `/2nd-hearing/style.less`
* 마크업
  * `/index.dev.html.php`
  * `/2nd-hearing/index.html`
* 스크립트
  * `/js/script.js`
  * `/2nd-hearing/script.js`

## permalink 구조
* 1차 청문회: `#hearing1`
  * 의혹 1 :  `#hearing1-1`
  * 의혹 2 :  `#hearing1-2`
  * 의혹 3 :  `#hearing1-3`
  * 의혹 4 :  `#hearing1-4`
  * 의혹 5 :  `#hearing1-5`
  * 의혹 6 :  `#hearing1-6`
  * 의혹 7 :  `#hearing1-7`
  * 의혹 8 :  `#hearing1-8`
  * 의혹 9 :  `#hearing1-9`
  * 의혹10 :  `#hearing1-10`
  * 의혹11 :  `#hearing1-11`
  * 의혹12 :  `#hearing1-12`
  * 의혹13 :  `#hearing1-13`
  * 의혹14 :  `#hearing1-14`
* 2차 청문회: `#hearing2`
  * 의혹 1 :  `#hearing2-1`
  * 의혹 2 :  `#hearing2-2`
  * 의혹 3 :  `#hearing2-3`
  * 의혹 4 :  `#hearing2-4`
  * 의혹 5 :  `#hearing2-5`
  * 의혹 6 :  `#hearing2-6`
* 416가족의 발자취: `#journal`

## 참고
* 2차 청문회 첫페이지 동영상 경로를 수정하려면 `/2nd-hearing/index.html`에서 `<div class="video-wrap" data-src=""></div>`을 찾아 `data-src`의 값을 수정한다.
* `less`나 `js`를 추가할 때는 `bundle.dev.js`에 파일 경로를 추가한다.
* `less`파일을 작성할 때 `-webkit-` 등의 접두어를 붙일 필요가 없다. 시스템이 붙여준다.
* `index.html.php`를 수정하고자 할 때는, `index.html.php` 대신에 `index.html.dev.php`를 수정한다. `index.html.php`는 `npm start`나 `npm run build`에 의해 생성되는 파일이다.
* `npm start`에 의해 생성되는 파일은 `index.html.php`, `bundle.js`이다.
* `npm run build`에 의해 생성되는 파일은 `index.html.php`, `bundle.css`, `bundle.js`이다.
