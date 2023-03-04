/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// const getAllBooksHandler = (request, h) => {
//   const { name, reading, finished } = request.query;
//   if (name) {
//     const book = books.filter((n) => n.name.toLowerCase() === name.toLowerCase());
//     const response = h.response({
//       status: 'success',
//       data: {
//         books: book.map((buku) => ({
//           id: buku.id,
//           name: buku.name,
//           publisher: buku.publisher,
//         })),
//       },
//     });
//     response.code(200);
//     return response;
//   }
//   if (reading) {
//     if (reading === '1') {
//       const book = books.filter((n) => n.reading === true);
//       const response = h.response({
//         status: 'success',
//         data: {
//           books: book.map((buku) => ({
//             id: buku.id,
//             name: buku.name,
//             publisher: buku.publisher,
//           })),
//         },
//       });
//       response.code(200);
//       return response;
//     }
//     if (reading === '0') {
//       const book = books.filter((n) => n.reading === false);
//       const response = h.response({
//         status: 'success',
//         data: {
//           books: book.map((buku) => ({
//             id: buku.id,
//             name: buku.name,
//             publisher: buku.publisher,
//           })),
//         },
//       });
//       response.code(200);
//       return response;
//     }
//   }
//   if (finished) {
//     if (finished === '1') {
//       const book = books.filter((n) => n.finished === true);
//       const response = h.response({
//         status: 'success',
//         data: {
//           books: book.map((buku) => ({
//             id: buku.id,
//             name: buku.name,
//             publisher: buku.publisher,
//           })),
//         },
//       });
//       response.code(200);
//       return response;
//     }

//     if (finished === '0') {
//       const book = books.filter((n) => n.finished === false);
//       const response = h.response({
//         status: 'success',
//         data: {
//           books: book.map((buku) => ({
//             id: buku.id,
//             name: buku.name,
//             publisher: buku.publisher,
//           })),
//         },
//       });
//       response.code(200);
//       return response;
//     }
//   }
//   if (!name && !reading && !finished) {
//     const response = h.response({
//       status: 'success',
//       data: {
//         books: books.map((buku) => ({
//           id: buku.id,
//           name: buku.name,
//           publisher: buku.publisher,
//         })),
//       },
//     });
//     response.code(200);
//     return response;
//   }
// };

const getAllBooksHandler = (request, h) => {
  const { name: qName, reading, finished } = request.query;

  let datas = books;

  if (qName) {
    datas = datas.filter((x) => x.name.toLowerCase().includes(qName.toLowerCase()));
  }
  if (reading) {
    datas = datas.filter((x) => x.reading === Boolean(Number(reading)));
  }
  if (finished) {
    datas = datas.filter((x) => x.finished === Boolean(Number(finished)));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: datas.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,

    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
