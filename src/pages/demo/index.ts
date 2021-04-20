import './index.scss';
import $ from 'jquery';

console.log('demo page success');
console.log($('.demo'));


/*
* 文件内按需加载，会自动打包成单独文件
* 还能懒加载JS
* webpackPrefetch: 预加载
document.getElementById('test').addEventListener('click', function () {
  import(/!* webpackChunkName: 'util', webpackPrefetch: true *!/'./a.js').then(({add, reduce}) => {
    // 文件加载成功
    add();
  }).catch(err => {
    // 文件加载失败
  })
});
*/
