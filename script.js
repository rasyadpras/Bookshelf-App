const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'booklist';
let form = document.getElementById("inputBook");

// cek mendukung storage
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage. Silakan ganti browser!');
    return false;
  }
  return true;
};

// bikin id
function generateId() {
  return +new Date();
};

// bikin object book
function addBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
};

// cek status udah read atau belom
function statusBook() {
  const isDone = document.getElementById("inputBookIsComplete");
  if (isDone.checked) {
     return true;
  }
  return false;
};

// nambahin data buku (masukin data)
function addDataBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = statusBook();

  const generatedID = generateId();
  const bookObject = addBookObject(generatedID, title, author, year, isCompleted);
  books.unshift(bookObject);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
};

// find book index using book id
function findBook(bookId) {
  for (const index in books) {
     if (books[index].id == bookId) {
        return index;
     }
  }
  return null;
};

// hapus buku
function removeBook(bookId) {
  const bookTarget = findBook(bookId);
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// pindah rak
function changeStatus(bookId) {
  const bookIndex = findBook(bookId);
  for (const index in books) {
     if (index === bookIndex) {
        if (books[index].isCompleted === true) {
           books[index].isCompleted = false;
        } else {
           books[index].isCompleted = true;
        }
     }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

// save data
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
};

// load data from storage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
     data.forEach((book) => {
        books.unshift(book);
     });
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  return books;
}

// buat nampilin data buku ke web
function makeListBook(books = []) {
  const incompleteBooks = document.getElementById("incompleteBookshelfList");
  const completeBooks = document.getElementById("completeBookshelfList");

  incompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";

  books.forEach((book) => {
     if (book.isCompleted == false) {
        let el = `
           <article class="book_item">
              <h3>${book.title}</h3>
              <p>${book.author}, ${book.year}</p>
              <div class="action">
                 <button class="green" onclick="changeStatus(${book.id})">Selesai dibaca</button>
                 <button class="red" onclick="removeBook(${book.id})">Hapus Buku</button>
              </div>
           </article>
           `;

        incompleteBooks.innerHTML += el;
     } else {
        let el = `
           <article class="book_item">
              <h3>${book.title}</h3>
              <p>${book.author}, ${book.year}</p>
              <div class="action">
                 <button class="green" onclick="changeStatus(${book.id})">Belum selesai dibaca</button>
                 <button class="red" onclick="removeBook(${book.id})">Hapus Buku</button>
              </div>
           </article>
           `;

        completeBooks.innerHTML += el;
     }
  });
};

// content loaded & submit form
document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", function (e) {
     e.preventDefault();
     addDataBook();
  });
  if (isStorageExist()) {
     loadDataFromStorage();
  }
});

// event listener
document.addEventListener(RENDER_EVENT, function () {
  makeListBook(books);
});