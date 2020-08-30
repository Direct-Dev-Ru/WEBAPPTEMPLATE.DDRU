class Foo {
   log(msg) {
     console.log(msg);
   } 
 }

var foo = new Foo();

document.addEventListener('DOMContentLoaded', () => {
   
   foo.log('Скрипт приложения запущен из объекта класса Foo!');      

});