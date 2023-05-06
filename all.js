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
