# 416hearing

## 시스템
* 인스톨: `npm install`
* 개발할 때: `npm start`
* 배포할 때: `npm run build`

## 2차 청문회 페이지 관련 파일
* 코드: `/2nd-hearing`
  * 증인관련: `/2nd-hearing/widtnesses.*`
* 데이터: `/data/2nd_hearing`
  * 증인정보: `/data/2nd_hearing/witnesses.json`
  * 증인프로필사진이 있는 곳: `/data/2nd_hearing/images`

## 참고
* `less`나 `js`를 추가할 때는 `bundle.dev.js`에 파일 경로를 추가한다.
* `less`파일을 작성할 때 `-webkit-` 등의 접두어를 붙일 필요가 없다. 시스템이 붙여준다.
* `index.html.php`를 수정하고자 할 때는, `index.html.php` 대신에 `index.html.dev.php`를 수정한다. `index.html.php`는 `npm start`나 `npm run build`에 의해 생성되는 파일이다.
* `npm start`에 의해 생성되는 파일은 `index.html.php`, `bundle.js`이다.
* `npm run build`에 의해 생성되는 파일은 `index.html.php`, `bundle.css`, `bundle.js`이다.
