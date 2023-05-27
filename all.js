// navbar hamburger
$('#navbar').on('show.bs.collapse', function () {
  $('#navbar-toggler-img').attr(
    'src',
    'https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/2023web-camp/icons/close.png'
  );
});

$('#navbar').on('hidden.bs.collapse', function () {
  $('#navbar-toggler-img').attr(
    'src',
    'https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/2023web-camp/icons/menu.png'
  );
});

// 資料串接
const apiPath = 'https://2023-engineer-camp.zeabur.app';
const toolList = document.querySelector('#tool-list');
const toolPagination = document.querySelector('#tool-pagination');

const query = {
  type: '',
  sort: 0,
  page: 1,
  search: '',
};

let worksData = [];
let pageData = {};

// AI 資料渲染
const renderData = () => {
  let works = "";
  worksData.forEach((item) => {
    works += /*html*/ `
    <div class="col">
      <div class="card ai-card border-light rounded-4 h-100" style="overflow: hidden;">
        <img src=${item.imageUrl} class="card-img-top" style="transition: all .3s;" alt=${item.title}>
        <div class="card-body bg-white" style="z-index: 1;">
          <h5 class="card-title fs-5 fw-bolder">${item.title}</h5>
          <p class="card-text text-gray-dark fs-8">${item.description}</p>
        </div>
        <div class="d-flex flex-column">
          <div class="card-body d-flex justify-content-between align-items-center py-3 border-top">
            <span class="fw-bold">AI 模型</span>
            <span>${item.model}</span>
          </div>
          <div class="card-body d-flex justify-content-between align-items-center py-3 border-top">
            <span class="text">#${item.type}</span>
            <a href="https://2023-engineer-camp-ai-template.vercel.app/" target="_blank" class="material-icons fs-7 text-dark text-decoration-none">share</a>
          </div>
        </div>
      </div>
    </div>
    `;
  });

  toolList.innerHTML = works;
}

// AI 頁碼渲染
const renderPage = () => {
  let pages = "";
  const pageArr = Array.from(
    { length: pageData.total_pages },
    (_, index) => index + 1
  );
  // console.log(pageArr)
  pages += /*html*/`
    <li class="page-item ${pageData.hasPre ? "" : "disabled"}">
      <a class="page-link fw-bold" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  pageArr.forEach(item => {
    pages += /*html*/ `
      <li class="page-item ${pageData.current_page == item ? "active" : ""}">
        <a class="page-link" href="#" data-page=${item}>${item}</a>
      </li>
    `;
  })
  pages += /*html*/ `
    <li class="page-item ${pageData.hasNext ? '' : 'disabled'}">
      <a class="page-link fw-bold" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
  toolPagination.innerHTML = pages;

  changePages();
}

// 切換頁碼
const changePages = () => {
  const pageLinks = document.querySelectorAll('.page-item');
  pageLinks.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      if (!e.target.dataset.page){
        // 判斷是否為 &laquo;
        if (e.target.textContent.trim().charCodeAt(0) === 171) {
          if(!e.target.classList.contains('disabled')) {
            query.page -= 1;
          }
        } else {
          if (!e.target.classList.contains('disabled')) {
            query.page += 1;
          }
        }
      } else {
        if (!e.target.classList.contains('active')) {
          query.page = parseInt(e.target.dataset.page);
        }
      }

      getData(query);
    })
  })
}

// 取得 AI 資料
const getData = ({ type, sort, page, search }) => {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}${type ? `&type=${type}` : ''}${search ? `&search=${search}` : ''}`;
  axios.get(apiUrl)
    .then(res => {
      // console.log(res);
      const {data, page} = res.data.ai_works;
      worksData = data;
      pageData = page;
      // console.log(worksData, pageData)
      renderData();
      renderPage();
    })
    .catch(err => {
      console.log(err);
    })
};
getData(query);

// AI 資料排序
const btnSort = document.querySelector('#btn-sort');
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.innerText.includes("由新到舊")) {
    query.sort = 1;
    getData(query);
    btnSort.innerHTML = /*html*/`
      <span>由舊到新</span>
      <span class="material-icons fs-7 ms-2">
        keyboard_arrow_up
      </span>
    `;
  } else {
    query.sort = 0;
    getData(query);
    btnSort.innerHTML = /*html*/ `
      <span>由新到舊</span>
      <span class="material-icons fs-7 ms-2">
        keyboard_arrow_down
      </span>
    `;
  }
})

// AI radios 切換
const aiRadios = document.querySelectorAll('.ai-radio');
aiRadios.forEach(item => {
  item.addEventListener("click", (e) => {
    if(e.target.dataset.text === "全部") {
      query.type = "";
      getData(query);
    } else {
      query.type = e.target.dataset.text;
      getData(query);
    }
  })
})

// AI 搜尋
const aiSearch = document.querySelector('#ai-search');
aiSearch.addEventListener('keydown', (e) => {
  if(e.keyCode === 13) {
    query.search = aiSearch.value;
    getData(query);
  }
})